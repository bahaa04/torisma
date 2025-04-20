from coupons.models import Coupon
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import CouponSerializer, CouponCreateSerializer, CouponUpdateSerializer
from users.models import User
from rest_framework import serializers
import logging
from django.http import request
from .tasks import send_coupon_email_task  # Import the Celery task

logger = logging.getLogger(__name__)

class CouponListCreateView(ListCreateAPIView):
    queryset = Coupon.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CouponCreateSerializer
        return CouponSerializer

    def perform_create(self, serializer):
        # Ensure the user is an admin
        if not self.request.user.is_staff:
            raise serializers.ValidationError("Only administrators can create coupons.")
        
        # Validate coupon dates
        data = serializer.validated_data
        if data['valid_from'] >= data['valid_to']:
            raise serializers.ValidationError("Valid from date must be before valid to date.")
        
        if data['valid_from'] < timezone.now():
            raise serializers.ValidationError("Valid from date cannot be in the past.")
        
        # Validate discount percentage
        if data['discount_percentage'] <= 0 or data['discount_percentage'] > 100:
            raise serializers.ValidationError("Discount percentage must be between 0 and 100.")
        
        coupon = serializer.save()
        
        # Send notification to all users if auto-notify is enabled
        if getattr(settings, 'COUPON_AUTO_NOTIFY', True):
            self._send_coupon_notification(coupon)

    def _send_coupon_notification(self, coupon):
        try:
            # Get all users
            users = User.objects.all()
            logger.info(f"Found {users.count()} users to notify.")

            # Prepare email context
            context = {
                'coupon_code': coupon.code,
                'discount_percentage': coupon.discount_percentage,
                'valid_from': coupon.valid_from.strftime('%Y-%m-%d'),
                'valid_to': coupon.valid_until.strftime('%Y-%m-%d'),
            }

            # Send email synchronously
            for user in users:
                if user.email:  # Ensure user has a valid email
                    try:
                        html_message = render_to_string('notifications/coupon_notification.html', context)
                        plain_message = strip_tags(html_message)
                        send_mail(
                            subject=getattr(settings, 'COUPON_NOTIFICATION_SUBJECT', 'New Coupon Available!'),
                            message=plain_message,
                            html_message=html_message,
                            from_email=getattr(settings, 'COUPON_NOTIFICATION_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL),
                            recipient_list=[user.email],
                            fail_silently=False,
                        )
                        logger.info(f"Email sent to {user.email}")
                    except Exception as e:
                        logger.error(f"Error sending email to {user.email}: {str(e)}")
                else:
                    logger.warning(f"User {user.id} has no email address.")
        except Exception as e:
            logger.error(f"Error in _send_coupon_notification: {str(e)}")

class CouponDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CouponUpdateSerializer
        return CouponSerializer

    def perform_update(self, serializer):
        # Ensure the user is an admin
        if not self.request.user.is_staff:
            raise serializers.ValidationError("Only administrators can update coupons.")
        
        # Validate coupon dates if they're being updated
        data = serializer.validated_data
        if 'valid_from' in data and 'valid_to' in data:
            if data['valid_from'] >= data['valid_to']:
                raise serializers.ValidationError("Valid from date must be before valid to date.")
        
        if 'valid_from' in data and data['valid_from'] < timezone.now():
            raise serializers.ValidationError("Valid from date cannot be in the past.")
        
        # Validate discount percentage if it's being updated
        if 'discount_percentage' in data:
            if data['discount_percentage'] <= 0 or data['discount_percentage'] > 100:
                raise serializers.ValidationError("Discount percentage must be between 0 and 100.")
        
        serializer.save()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_coupon(request, code):
    try:
        coupon = Coupon.objects.get(code=code)
        now = timezone.now()

        # Check if the coupon is active and not expired
        if coupon.is_active and coupon.valid_from <= now <= coupon.valid_to:
            return Response({
                "valid": True,
                "discount_percentage": coupon.discount_percentage,
                "code": coupon.code,
                "valid_to": coupon.valid_to
            })
        else:
            # Deactivate the coupon if expired
            if coupon.valid_to < now:
                coupon.is_active = False
                coupon.save()
            return Response(
                {"valid": False, "error": "Coupon expired or inactive"},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Coupon.DoesNotExist:
        return Response(
            {"valid": False, "error": "Invalid coupon code"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAdminUser])
def send_coupon_notification(request, coupon_id):
    try:
        # Ensure the user is an admin
        if not request.user.is_staff:
            return Response(
                {"error": "Only administrators can send coupon notifications"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        coupon = Coupon.objects.get(id=coupon_id)
        
        # Check if coupon is active
        if not coupon.is_active:
            return Response(
                {"error": "Coupon is not active yet"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get all users
        users = User.objects.all()
        
        # Prepare email context
        context = {
            'coupon_code': coupon.code,
            'discount_percentage': coupon.discount_percentage,
            'valid_from': coupon.valid_from.strftime('%Y-%m-%d'),
            'valid_to': coupon.valid_to.strftime('%Y-%m-%d'),
        }
        
        # Render email template
        html_message = render_to_string('notifications/coupon_notification.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email to all users
        for user in users:
            send_mail(
                subject=getattr(settings, 'COUPON_NOTIFICATION_SUBJECT', 'New Coupon Available!'),
                message=plain_message,
                html_message=html_message,
                from_email=getattr(settings, 'COUPON_NOTIFICATION_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL),
                recipient_list=[user.email],
                fail_silently=False,
            )
        
        return Response(
            {"message": f"Coupon notification sent to {users.count()} users"},
            status=status.HTTP_200_OK
        )
        
    except Coupon.DoesNotExist:
        return Response(
            {"error": "Coupon not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Import necessary modules and models

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def list(self, request, *args, **kwargs):
        """
        Custom list view to return only valid coupons (active and within valid time).
        """
        current_time = timezone.now()
        valid_coupons = Coupon.objects.filter(is_active=True, valid_from__lte=current_time, valid_until__gte=current_time)
        serializer = self.get_serializer(valid_coupons, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Custom create view (Optional, can use default create behavior).
        """
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def validate(self, request, pk=None):
        """
        Custom action to validate if a specific coupon is still valid.
        """
        coupon = self.get_object()
        if coupon.is_valid():
            return Response({'status': 'valid'})
        return Response({'status': 'expired'})

# Create your views here.

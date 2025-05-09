from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from .models import CarReservation, HouseReservation
from .serializers import CarReservationSerializer, HouseReservationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from .stripe_payment import create_stripe_payment_intent, create_checkout_session
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.urls import reverse
from datetime import timedelta

class CarReservationViewSet(viewsets.ModelViewSet):
    queryset = CarReservation.objects.all()
    serializer_class = CarReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        reservation = serializer.save(user=self.request.user)
        if reservation.payment_method == 'cash':
            reservation.payment_status = 'pending'
            reservation.save()
            self.send_cash_confirmation(reservation)
        return reservation

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        reservation = self.get_object()
        if reservation.payment_method == 'cash':
            return self.handle_cash_payment(reservation)
        elif reservation.payment_method == 'mastercard':
            return self.handle_card_payment(reservation)
        return Response({"error": "Invalid payment method"}, status=400)

    def handle_cash_payment(self, reservation):
        # Handle cash payment logic
        pass

    def handle_card_payment(self, reservation):
        # Handle card payment logic
        pass

    def send_cash_confirmation(self, reservation):
        context = {
            'username': reservation.user.username,
            'item_title': f"{reservation.car.manufacture} {reservation.car.model}",
            'start_date': reservation.start_date,
            'end_date': reservation.end_date,
            'total_price': reservation.total_price,
            'owner_phone': reservation.seller.phone_number
        }
        html_message = render_to_string('email/transaction_confirmation.html', context)
        plain_message = strip_tags(html_message)
        send_mail(
            subject='Reservation Confirmation',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[reservation.user.email],
            html_message=html_message
        )

class HouseReservationViewSet(viewsets.ModelViewSet):
    queryset = HouseReservation.objects.all()
    serializer_class = HouseReservationSerializer
    permission_classes = [IsAuthenticated]

    # Similar implementation as CarReservationViewSet

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    payment_intent_id = request.data.get('payment_intent_id')
    reservation_id = request.data.get('reservation_id')
    
    try:
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if payment_intent.status == 'succeeded':
            reservation = CarReservation.objects.get(id=reservation_id)
            reservation.payment_status = 'completed'
            reservation.payment_reference = payment_intent_id
            reservation.save()
            return Response({'status': 'success'})
        return Response({'error': 'Payment not completed'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_cash_payment(request, reservation_id):
    try:
        reservation = CarReservation.objects.get(id=reservation_id)
        if reservation.payment_method != 'cash':
            return Response({"error": "Invalid payment method"}, status=400)
        
        reservation.payment_status = 'pending'
        reservation.save()
        return Response({"status": "Cash payment initiated"})
    except CarReservation.DoesNotExist:
        try:
            reservation = HouseReservation.objects.get(id=reservation_id)
            # Same logic as above
        except HouseReservation.DoesNotExist:
            return Response({"error": "Reservation not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_cash_payment(request, reservation_id):
    try:
        reservation = CarReservation.objects.get(id=reservation_id)
        if reservation.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        reservation.payment_status = 'completed'
        reservation.status = 'confirmed'
        reservation.save()
        return Response({"status": "Payment confirmed"})
    except CarReservation.DoesNotExist:
        # Similar logic for HouseReservation
        pass

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_stripe_payment(request, reservation_id):
    try:
        reservation = CarReservation.objects.get(id=reservation_id)
        if reservation.payment_method != 'mastercard':
            return Response({"error": "Invalid payment method"}, status=400)
        
        intent = create_stripe_payment_intent(
            amount=reservation.total_price,
            currency='eur',
            metadata={'reservation_id': str(reservation_id)}
        )
        return Response({
            'client_secret': intent.client_secret,
            'reservation_id': str(reservation_id)
        })
    except CarReservation.DoesNotExist:
        # Similar logic for HouseReservation
        pass

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request, reservation_id):
    try:
        reservation = CarReservation.objects.get(id=reservation_id)
        if reservation.user != request.user and reservation.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        return Response({
            "status": reservation.payment_status,
            "payment_method": reservation.payment_method
        })
    except CarReservation.DoesNotExist:
        # Similar logic for HouseReservation
        pass

@csrf_exempt
@require_POST
def stripe_webhook_handler(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )

        if event['type'] == 'payment_intent.succeeded':
            # Handle successful payment
            payment_intent = event['data']['object']
            reservation_id = payment_intent.metadata.get('reservation_id')
            if reservation_id:
                try:
                    reservation = CarReservation.objects.get(id=reservation_id)
                    reservation.payment_status = 'completed'
                    reservation.status = 'confirmed'
                    reservation.payment_reference = payment_intent.id
                    reservation.save()
                except CarReservation.DoesNotExist:
                    # Try HouseReservation
                    pass

        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_cash_verification_email(request, reservation_id):
    try:
        # Try to get car reservation first
        try:
            reservation = CarReservation.objects.get(id=reservation_id)
            item_title = f"{reservation.car.manufacture} {reservation.car.model}"
            daily_price = reservation.car.price
        except CarReservation.DoesNotExist:
            reservation = HouseReservation.objects.get(id=reservation_id)
            item_title = reservation.house.title
            daily_price = reservation.house.price

        if reservation.payment_method != 'cash':
            return Response({"error": "Invalid payment method"}, status=400)

        total_days = (reservation.end_date - reservation.start_date).days
        
        # Prepare email context
        context = {
            'username': reservation.user.username,
            'item_title': item_title,
            'start_date': reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': reservation.end_date.strftime('%Y-%m-%d'),
            'daily_price': daily_price,
            'total_days': total_days,
            'total_price': reservation.total_price,
            'owner_phone': reservation.seller.phone_number,
            'due_date': timezone.now().strftime('%Y-%m-%d'),
            'confirmation_url': request.build_absolute_uri(
                reverse('confirm_cash_payment', kwargs={'reservation_id': reservation_id})
            ),
            'cancellation_url': request.build_absolute_uri(
                reverse('cancel_rental', kwargs={'reservation_id': reservation_id})
            ),
            'cancellation_date': (timezone.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
        }

        # Choose template based on payment method
        template_name = 'email/cash_payment_confirmation.html'
        subject = 'Cash Payment Instructions'

        # Render email template
        html_message = render_to_string(template_name, context)
        plain_message = strip_tags(html_message)

        # Send email to both user and seller
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[reservation.user.email, reservation.seller.email],
            html_message=html_message
        )

        return Response({
            "status": "success",
            "message": "Payment instructions sent"
        })

    except (CarReservation.DoesNotExist, HouseReservation.DoesNotExist):
        return Response({"error": "Reservation not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)



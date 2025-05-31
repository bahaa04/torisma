from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError
from .models import CarReservation, HouseReservation
from .serializers import CarReservationSerializer, HouseReservationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
import pytz
from datetime import datetime
from rest_framework.exceptions import ValidationError

from .stripe_payment import create_stripe_payment_intent, create_checkout_session
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.urls import reverse
from datetime import timedelta
from django.db.models import Q
from pytz import UTC  # Add this import at the top

class CarReservationViewSet(viewsets.ModelViewSet):
    queryset = CarReservation.objects.all()
    serializer_class = CarReservationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        user = serializer.validated_data.get('user', self.request.user)
        car = serializer.validated_data.get('car')
        start_date = serializer.validated_data.get('start_date')
        end_date = serializer.validated_data.get('end_date')
        payment_method = serializer.validated_data.get('payment_method')
        
        # Check if dates are already datetime objects
        if isinstance(start_date, str):
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
        if isinstance(end_date, str):
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        
        # Set time to midnight and add UTC timezone
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Add timezone if naive
        if timezone.is_naive(start_date):
            start_date = pytz.UTC.localize(start_date)
        if timezone.is_naive(end_date):
            end_date = pytz.UTC.localize(end_date)
        
        # Check for overlapping reservations
        overlapping_reservations = CarReservation.objects.filter(
            car=car,
            status__in=['confirmed', 'pending'],
            start_date__lt=end_date,
            end_date__gt=start_date
        ).exclude(status__in=['cancelled', 'failed'])
        
        if overlapping_reservations.exists():
            conflicting = overlapping_reservations.first()
            raise ValidationError({
                'error': 'Car is already rented during this period',
                'conflicting_period': {
                    'start_date': conflicting.start_date.strftime('%Y-%m-%d'),
                    'end_date': conflicting.end_date.strftime('%Y-%m-%d')
                }
            })
        
        # Update the validated data with timezone-aware dates
        serializer.validated_data['start_date'] = start_date
        serializer.validated_data['end_date'] = end_date
        
        # Create the reservation
        reservation = serializer.save()
        
        if payment_method == 'cash':
            # Set status to pending and send confirmation email
            reservation.payment_status = 'pending'
            reservation.status = 'pending'
            reservation.save()
            
            # Mark car as rented for this period
            car.status = 'rented'
            car.save()
            
            self.send_cash_confirmation(reservation)
            return Response({
                'status': 'success',
                'message': 'Reservation created successfully. Check your email for confirmation.',
                'reservation_id': reservation.id
            })
        
        elif payment_method == 'card':
            # Set initial status
            reservation.payment_status = 'pending'
            reservation.status = 'pending'
            reservation.save()
            
            # Create payment intent and return payment info
            return Response({
                'status': 'redirect_to_payment',
                'reservation_id': reservation.id,
                'payment_url': f'/payment?reservation_id={reservation.id}&type=car'
            })
        
        return reservation

    def send_cash_confirmation(self, reservation):
        context = {
            'username': reservation.user.username,
            'item_title': f"{reservation.car.manufacture} {reservation.car.model}",
            'start_date': reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': reservation.end_date.strftime('%Y-%m-%d'),
            'total_price': reservation.total_price,
            'owner_phone': reservation.car.owner.phone_number,
            'reservation_id': reservation.id,
            'confirmation_expires': (reservation.start_date + timedelta(hours=24)).strftime('%Y-%m-%d %H:%M')
        }

        html_message = render_to_string('email/transaction_confirmation.html', context)
        plain_message = strip_tags(html_message)

        # Send email to renter
        send_mail(
            subject='Confirmation de Réservation',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[reservation.user.email],
            html_message=html_message
        )

        # Send email to owner
        owner_context = {
            'owner_name': reservation.car.owner.username,
            'renter_name': reservation.user.username,
            'renter_phone': reservation.user.phone_number,
            'renter_email': reservation.user.email,
            'item_type': 'voiture',
            'start_date': reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': reservation.end_date.strftime('%Y-%m-%d'),
            'status': 'en attente de paiement'
        }
        
        owner_html_message = render_to_string('email/owner_notification.html', owner_context)
        owner_plain_message = strip_tags(owner_html_message)
        
        send_mail(
            subject='Nouvelle Réservation',
            message=owner_plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[reservation.car.owner.email],
            html_message=owner_html_message
        )

class HouseReservationViewSet(viewsets.ModelViewSet):
    queryset = HouseReservation.objects.all()
    serializer_class = HouseReservationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        user = serializer.validated_data.get('user', self.request.user)
        house = serializer.validated_data.get('house')
        start_date = serializer.validated_data.get('start_date')
        end_date = serializer.validated_data.get('end_date')
        payment_method = serializer.validated_data.get('payment_method')
        
        try:
            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
            if isinstance(end_date, str):
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
            
            # Set time to midnight
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Add timezone if naive
            if timezone.is_naive(start_date):
                start_date = pytz.UTC.localize(start_date)
            if timezone.is_naive(end_date):
                end_date = pytz.UTC.localize(end_date)
        
        except ValueError as e:
            raise ValidationError(f"Invalid date format: {str(e)}")
        
        # Update the validated data with timezone-aware dates
        serializer.validated_data['start_date'] = start_date
        serializer.validated_data['end_date'] = end_date
        
        # Check for overlapping reservations
        overlapping_reservations = HouseReservation.objects.filter(
            house=house,
            status__in=['confirmed', 'pending'],
            start_date__lt=end_date,
            end_date__gt=start_date
        ).exclude(status__in=['cancelled', 'failed'])
        
        if overlapping_reservations.exists():
            conflicting = overlapping_reservations.first()
            raise ValidationError({
                'error': 'House is already rented during this period',
                'conflicting_period': {
                    'start_date': conflicting.start_date.strftime('%Y-%m-%d'),
                    'end_date': conflicting.end_date.strftime('%Y-%m-%d')
                }
            })
        
        # Create reservation
        reservation = serializer.save()
        
        if payment_method == 'cash':
            # Set status to pending and send confirmation email
            reservation.payment_status = 'pending'
            reservation.status = 'pending'
            reservation.save()
            
            # Mark house as rented for this period
            house.status = 'rented'
            house.save()
            
            self.send_cash_confirmation(reservation)
            return Response({
                'status': 'success',
                'message': 'Reservation created successfully. Check your email for confirmation.',
                'reservation_id': reservation.id
            })
        
        elif payment_method == 'card':
            # Set initial status
            reservation.payment_status = 'pending'
            reservation.status = 'pending'
            reservation.save()
            
            # Create payment intent and return payment info
            return Response({
                'status': 'redirect_to_payment',
                'reservation_id': reservation.id,
                'payment_url': f'/payment?reservation_id={reservation.id}&type=house'
            })
        
        return reservation

    def send_cash_confirmation(self, reservation):
        context = {
            'username': reservation.user.username,
            'item_title': f"Location à {reservation.house.wilaya}",
            'start_date': reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': reservation.end_date.strftime('%Y-%m-%d'),
            'total_price': reservation.total_price,
            'owner_phone': reservation.house.owner.phone_number,
            'reservation_id': reservation.id,
            'confirmation_expires': (reservation.start_date + timedelta(hours=24)).strftime('%Y-%m-%d %H:%M')
        }

        html_message = render_to_string('email/transaction_confirmation.html', context)
        plain_message = strip_tags(html_message)

        # Send email to renter
        send_mail(
            subject='Confirmation de Réservation',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[reservation.user.email],
            html_message=html_message
        )

        # Send email to owner
        owner_context = {
            'owner_name': reservation.house.owner.username,
            'renter_name': reservation.user.username,
            'renter_phone': reservation.user.phone_number,
            'renter_email': reservation.user.email,
            'item_type': 'maison',
            'start_date': reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': reservation.end_date.strftime('%Y-%m-%d'),
            'status': 'en attente de paiement'
        }
        
        owner_html_message = render_to_string('email/owner_notification.html', owner_context)
        owner_plain_message = strip_tags(owner_html_message)
        
        send_mail(
            subject='Nouvelle Réservation',
            message=owner_plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[reservation.house.owner.email],
            html_message=owner_html_message
        )

@api_view(['POST'])
def check_availability(request):
    """
    Check if a car or house is available for the specified date range.
    """
    try:
        item_type = request.data.get('item_type')  # 'car' or 'house'
        item_id = request.data.get('item_id')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Convert string dates to datetime objects
        try:
            start_date = datetime.strptime(start_date, '%m/%d/%Y').replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            end_date = datetime.strptime(end_date, '%m/%d/%Y').replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            
            # Add timezone
            start_date = UTC.localize(start_date)
            end_date = UTC.localize(end_date)

        except (ValueError, TypeError) as e:
            print(f"Date parsing error: {e}, received dates - start: {start_date}, end: {end_date}")
            return Response({
                'available': False,
                'error': 'Format de date invalide'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if start_date is not in the past
        if start_date.date() < timezone.now().date():
            return Response({
                'available': False,
                'error': 'La date de début ne peut pas être dans le passé'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if end_date is after start_date
        if end_date <= start_date:
            return Response({
                'available': False,
                'error': 'La date de fin doit être après la date de début'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check overlapping reservations
        if item_type == 'car':
            overlapping = CarReservation.objects.filter(
                car_id=item_id,
                status__in=['pending', 'confirmed'],
                start_date__lt=end_date,
                end_date__gt=start_date
            ).exclude(status__in=['cancelled', 'failed']).first()

        else:  # house
            overlapping = HouseReservation.objects.filter(
                house_id=item_id,
                status__in=['pending', 'confirmed'],
                start_date__lt=end_date,
                end_date__gt=start_date
            ).exclude(status__in=['cancelled', 'failed']).first()

        if overlapping:
            return Response({
                'available': False,
                'error': f'Déjà réservé du {overlapping.start_date.strftime("%Y-%m-%d")} au {overlapping.end_date.strftime("%Y-%m-%d")}',
                'conflicting_period': {
                    'start_date': overlapping.start_date.strftime('%Y-%m-%d'),
                    'end_date': overlapping.end_date.strftime('%Y-%m-%d')
                }
            })

        return Response({'available': True})

    except Exception as e:
        print(f"Availability check error: {str(e)}")
        return Response({
            'available': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def process_payment_result(request):
    """
    Handle payment completion results from the payment page
    """
    try:
        reservation_id = request.data.get('reservation_id')
        payment_status = request.data.get('payment_status')  # 'completed' or 'failed'
        item_type = request.data.get('item_type')  # 'car' or 'house'
        
        if item_type == 'car':
            reservation = CarReservation.objects.get(id=reservation_id)
            item = reservation.car
            redirect_url = f'/voiture/{item.id}'
        else:
            reservation = HouseReservation.objects.get(id=reservation_id)
            item = reservation.house
            redirect_url = f'/localisation/{item.id}'
        
        if payment_status == 'completed':
            # Payment successful - confirm reservation
            reservation.payment_status = 'completed'
            reservation.status = 'confirmed'
            reservation.save()
            
            # Keep item status as rented
            item.status = 'rented'
            item.save()
            
            # Send confirmation email (same as cash method)
            if item_type == 'car':
                context = {
                    'username': reservation.user.username,
                    'item_title': f"{reservation.car.manufacture} {reservation.car.model}",
                    'start_date': reservation.start_date.strftime('%Y-%m-%d'),
                    'end_date': reservation.end_date.strftime('%Y-%m-%d'),
                    'total_price': reservation.total_price,
                    'owner_phone': reservation.car.owner.phone_number,
                    'reservation_id': reservation.id
                }
            else:
                context = {
                    'username': reservation.user.username,
                    'item_title': f"Location à {reservation.house.wilaya}",
                    'start_date': reservation.start_date.strftime('%Y-%m-%d'),
                    'end_date': reservation.end_date.strftime('%Y-%m-%d'),
                    'total_price': reservation.total_price,
                    'owner_phone': reservation.house.owner.phone_number,
                    'reservation_id': reservation.id
                }
            
            html_message = render_to_string('email/payment_success.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject='Paiement Confirmé - Réservation',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[reservation.user.email],
                html_message=html_message
            )
            
            return Response({
                'status': 'success',
                'message': 'Payment completed successfully',
                'redirect_url': redirect_url
            })
        
        else:  # payment_status == 'failed'
            # Payment failed - cancel reservation
            reservation.payment_status = 'failed'
            reservation.status = 'failed'
            reservation.save()
            
            # Make item available again
            item.status = 'available'
            item.save()
            
            return Response({
                'status': 'failed',
                'message': 'Payment failed. Reservation cancelled.',
                'redirect_url': redirect_url
            })
    
    except (CarReservation.DoesNotExist, HouseReservation.DoesNotExist):
        return Response({'error': 'Reservation not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def confirm_cash_payment(request, reservation_id):
    """
    Confirm cash payment - owner confirms they received payment
    """
    try:
        # Try car reservation first
        try:
            reservation = CarReservation.objects.get(id=reservation_id)
            item = reservation.car
            owner = reservation.car.owner
        except CarReservation.DoesNotExist:
            reservation = HouseReservation.objects.get(id=reservation_id)
            item = reservation.house
            owner = reservation.house.owner
        
        # Check if confirmation link is expired (24 hours after start date)
        expiry_time = reservation.start_date + timedelta(hours=24)
        if timezone.now() > expiry_time:
            # Expired - cancel reservation and make item available
            reservation.status = 'cancelled'
            reservation.payment_status = 'expired'
            reservation.save()
            
            item.status = 'available'
            item.save()
            
            return Response({
                "error": "Confirmation link expired",
                "status": "cancelled"
            }, status=400)
        
        # Check if user is the owner
        if owner != request.user:
            return Response({"error": "Not authorized"}, status=403)
        
        # Confirm payment
        reservation.payment_status = 'completed'
        reservation.status = 'confirmed'
        reservation.save()
        
        # Keep item status as rented
        item.status = 'rented'
        item.save()
        
        return Response({"status": "success", "message": "Payment confirmed"})
    
    except (CarReservation.DoesNotExist, HouseReservation.DoesNotExist):
        return Response({"error": "Reservation not found"}, status=404)

@api_view(['POST'])
def cancel_reservation(request, reservation_id):
    """
    Cancel a reservation
    """
    try:
        # Try car reservation first
        try:
            reservation = CarReservation.objects.get(id=reservation_id)
            item = reservation.car
        except CarReservation.DoesNotExist:
            reservation = HouseReservation.objects.get(id=reservation_id)
            item = reservation.house

        # Check if reservation is already confirmed
        if reservation.status == 'confirmed':
            return Response({
                "error": "Impossible d'annuler une réservation déjà confirmée",
                "status": "confirmed"
            }, status=400)

        # Check if user is authorized (owner or renter can cancel)
        if request.user != reservation.user and request.user != item.owner:
            return Response({
                "error": "Non autorisé à annuler cette réservation"
            }, status=403)

        # Update reservation status
        reservation.status = 'cancelled'
        reservation.payment_status = 'cancelled'
        reservation.save()

        # Update item status back to available
        item.status = 'available'
        item.save()

        return Response({
            "status": "success",
            "message": "Réservation annulée avec succès"
        })

    except (CarReservation.DoesNotExist, HouseReservation.DoesNotExist):
        return Response({"error": "Réservation introuvable"}, status=404)

@api_view(['GET'])
def get_reservation_details(request, reservation_id):
    """
    Get reservation details for payment processing
    """
    try:
        item_type = request.GET.get('type', 'car')
        
        if item_type == 'car':
            reservation = CarReservation.objects.get(id=reservation_id)
            item_title = f"{reservation.car.manufacture} {reservation.car.model}"
        else:
            reservation = HouseReservation.objects.get(id=reservation_id)
            item_title = reservation.house.title
        
        return Response({
            'reservation_id': reservation.id,
            'item_title': item_title,
            'total_price': reservation.total_price,
            'start_date': reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': reservation.end_date.strftime('%Y-%m-%d'),
            'status': reservation.status,
            'payment_status': reservation.payment_status
        })
    
    except (CarReservation.DoesNotExist, HouseReservation.DoesNotExist):
        return Response({'error': 'Reservation not found'}, status=404)

# Keep existing webhook and other utility functions
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
                    
                    # Update car status to rented
                    car = reservation.car
                    car.status = 'rented'
                    car.save()
                except CarReservation.DoesNotExist:
                    try:
                        reservation = HouseReservation.objects.get(id=reservation_id)
                        reservation.payment_status = 'completed'
                        reservation.status = 'confirmed'
                        reservation.payment_reference = payment_intent.id
                        reservation.save()
                        
                        # Update house status to rented
                        house = reservation.house
                        house.status = 'rented'
                        house.save()
                    except HouseReservation.DoesNotExist:
                        pass

        elif event['type'] == 'payment_intent.payment_failed':
            # Handle failed payment
            payment_intent = event['data']['object']
            reservation_id = payment_intent.metadata.get('reservation_id')
            if reservation_id:
                try:
                    reservation = CarReservation.objects.get(id=reservation_id)
                    reservation.payment_status = 'failed'
                    reservation.status = 'failed'
                    reservation.save()
                    
                    # Return car to available
                    car = reservation.car
                    car.status = 'available'
                    car.save()
                except CarReservation.DoesNotExist:
                    try:
                        reservation = HouseReservation.objects.get(id=reservation_id)
                        reservation.payment_status = 'failed'
                        reservation.status = 'failed'
                        reservation.save()
                        
                        # Return house to available
                        house = reservation.house
                        house.status = 'available'
                        house.save()
                    except HouseReservation.DoesNotExist:
                        pass

        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
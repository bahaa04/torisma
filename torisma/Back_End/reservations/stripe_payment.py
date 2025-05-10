import stripe
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import CarReservation, HouseReservation
import json

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY
stripe.api_version = settings.STRIPE_API_VERSION

def create_stripe_payment_intent(amount, currency='eur', capture_method='automatic', metadata=None):
    """Create a Stripe PaymentIntent"""
    try:
        payment_intent_data = {
            'amount': int(amount * 100),  # Convert to cents
            'currency': currency,
            'payment_method_types': ['card'],
            'capture_method': capture_method,
            'metadata': {
                'integration_check': 'accept_a_payment',
                **(metadata or {})
            }
        }

        intent = stripe.PaymentIntent.create(**payment_intent_data)
        return intent
    except stripe.error.StripeError as e:
        raise Exception(f"Stripe error: {str(e)}")

def send_confirmation_email(reservation):
    """Send confirmation email for reservation"""
    try:
        if isinstance(reservation, CarReservation):
            item_title = f"{reservation.car.manufacture} {reservation.car.model}"
            owner_phone = reservation.seller.phone_number
        else:
            item_title = reservation.house.title
            owner_phone = reservation.seller.phone_number

        context = {
            'username': reservation.user.username,
            'item_title': item_title,
            'start_date': reservation.start_date,
            'end_date': reservation.end_date,
            'total_price': reservation.total_price,
            'owner_phone': owner_phone
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

    except Exception as e:
        print(f"Error sending confirmation email: {str(e)}")

def create_checkout_session(user_id, items, metadata=None):
    """Create a Stripe Checkout Session"""
    try:
        line_items = []
        for item in items:
            line_items.append({
                'price_data': {
                    'currency': 'eur',
                    'unit_amount': int(float(item['price']) * 100),
                    'product_data': {
                        'name': item['name'],
                    },
                },
                'quantity': 1,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/cancel",
            metadata={
                'user_id': str(user_id),
                **(metadata or {})
            }
        )
        return session
    except stripe.error.StripeError as e:
        raise Exception(f"Stripe error: {str(e)}")

def handle_checkout_completed(session):
    """Handle successful checkout completion"""
    try:
        metadata = session.metadata
        reservation_id = metadata.get('reservation_id')
        reservation_type = metadata.get('reservation_type')

        # Get reservation based on type
        if reservation_type == 'car':
            reservation = CarReservation.objects.get(id=reservation_id)
        else:
            reservation = HouseReservation.objects.get(id=reservation_id)

        # Update reservation status
        reservation.payment_status = 'completed'
        reservation.payment_reference = session.payment_intent
        reservation.save()

        # Send confirmation email
        send_confirmation_email(reservation)
        
        return reservation

    except Exception as e:
        raise Exception(f"Error handling checkout completion: {str(e)}")
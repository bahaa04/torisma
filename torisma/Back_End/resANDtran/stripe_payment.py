import stripe
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import CarTransaction, HouseTransaction

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_stripe_payment_intent(amount, currency='dzd', capture_method='automatic'):
    """Create a Stripe PaymentIntent"""
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency=currency,
            payment_method_types=['card'],
            capture_method=capture_method,
            metadata={
                'integration_check': 'accept_a_payment'
            }
        )
        return intent
    except stripe.error.StripeError as e:
        raise Exception(f"Stripe error: {str(e)}")

def handle_stripe_payment_success(transaction_id, payment_intent_id):
    """Handle successful Stripe payment"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                raise Exception("Transaction not found")

        # Update transaction status
        transaction.status = 'completed'
        transaction.payment_status = 'completed'
        transaction.payment_reference = payment_intent_id
        transaction.save()

        # Send confirmation emails
        send_confirmation_emails(transaction)

        return True
    except Exception as e:
        raise Exception(f"Error handling payment success: {str(e)}")

def send_confirmation_emails(transaction):
    """Send confirmation emails to both buyer and seller"""
    try:
        # Send to buyer
        buyer_context = {
            'username': transaction.buyer.username,
            'amount': transaction.payment_details.get('amount', 0),
            'payment_method': 'Stripe',
            'transaction_id': str(transaction.id),
            'item_name': transaction.car.manufacture if isinstance(transaction, CarTransaction) else transaction.house.title
        }

        buyer_html_message = render_to_string('email/transaction_confirmation.html', buyer_context)
        buyer_plain_message = strip_tags(buyer_html_message)

        send_mail(
            subject='Payment Confirmation',
            message=buyer_plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[transaction.buyer.email],
            html_message=buyer_html_message
        )

        # Send to seller
        seller_context = {
            'owner_name': transaction.seller.username,
            'renter_name': transaction.buyer.username,
            'renter_phone': transaction.buyer.phone_number,
            'renter_email': transaction.buyer.email,
            'amount': transaction.payment_details.get('amount', 0),
            'payment_method': 'Stripe',
            'transaction_id': str(transaction.id),
            'item_name': transaction.car.manufacture if isinstance(transaction, CarTransaction) else transaction.house.title
        }

        seller_html_message = render_to_string('email/owner_notification.html', seller_context)
        seller_plain_message = strip_tags(seller_html_message)

        send_mail(
            subject='New Rental Payment Received',
            message=seller_plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[transaction.seller.email],
            html_message=seller_html_message
        )

    except Exception as e:
        raise Exception(f"Error sending confirmation emails: {str(e)}")
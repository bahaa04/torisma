import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.apps import apps

@csrf_exempt
def stripe_webhook_handler(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({'error': 'Invalid signature'}, status=400)

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        handle_payment_success(payment_intent)
    elif event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)

    return JsonResponse({'status': 'success'}, status=200)

def handle_payment_success(payment_intent):
    stripe_payment_id = payment_intent['id']
    amount_received = payment_intent['amount_received'] / 100  # Convert cents to dollars
    StripePayment = apps.get_model('resANDtran', 'StripePayment')  # Dynamically load model
    StripePayment.objects.filter(stripe_payment_intent_id=stripe_payment_id).update(
        status='completed', amount=amount_received
    )

def handle_checkout_session(session):
    stripe_payment_id = session['payment_intent']
    StripePayment = apps.get_model('resANDtran', 'StripePayment')  # Dynamically load model
    StripePayment.objects.filter(stripe_payment_intent_id=stripe_payment_id).update(
        status='completed'
    )

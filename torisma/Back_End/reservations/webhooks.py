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
        # Invalid payload
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return JsonResponse({'error': 'Invalid signature'}, status=400)

    # Handle specific event types
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        try:
            transaction = handle_checkout_completed(session)
            return JsonResponse({
                "status": "success",
                "transaction_id": str(transaction.id)
            })
        except Exception as e:
            return JsonResponse({
                "error": f"Error processing checkout: {str(e)}"
            }, status=500)
    
    elif event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        try:
            handle_payment_success(payment_intent)
            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({
                "error": f"Error processing payment: {str(e)}"
            }, status=500)
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        error_message = payment_intent.get('last_payment_error', {}).get('message', '')
        return JsonResponse({
            "error": f"Payment failed: {error_message}"
        }, status=400)

    # Unexpected event type
    return JsonResponse({
        'status': 'unhandled',
        'type': event['type']
    })

def handle_payment_success(payment_intent):
    stripe_payment_id = payment_intent['id']
    amount_received = payment_intent['amount_received'] / 100  # Convert cents to dollars
    
    # Get reservation from metadata
    reservation_id = payment_intent.metadata.get('reservation_id')
    reservation_type = payment_intent.metadata.get('reservation_type')

    if reservation_type == 'car':
        reservation = CarReservation.objects.get(id=reservation_id)
        # Update car status
        car = reservation.car
        car.status = 'rented'
        car.save()
    else:
        reservation = HouseReservation.objects.get(id=reservation_id)
        # Update house status
        house = reservation.house
        house.status = 'rented'
        house.save()

    # Update reservation status
    reservation.status = 'confirmed'
    reservation.payment_status = 'completed'
    reservation.payment_reference = stripe_payment_id
    reservation.save()

    # Send confirmation email
    send_confirmation_email(reservation)

    return reservation

def handle_checkout_completed(session):
    stripe_payment_id = session['payment_intent']
    StripePayment = apps.get_model('reservations', 'StripePayment')  # Dynamically load model
    transaction = StripePayment.objects.filter(stripe_payment_intent_id=stripe_payment_id).update(
        status='completed'
    )
    return transaction

def handle_checkout_session(session):
    stripe_payment_id = session['payment_intent']
    StripePayment = apps.get_model('reservations', 'StripePayment')  # Dynamically load model
    StripePayment.objects.filter(stripe_payment_intent_id=stripe_payment_id).update(
        status='completed'
    )

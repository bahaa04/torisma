from rest_framework.response import Response
from rest_framework import serializers, viewsets, permissions, status
from .models import CarReservation, HouseReservation, CarTransaction, HouseTransaction
from .serializers import CarReservationSerializer, HouseReservationSerializer, CarTransactionSerializer, HouseTransactionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404, render
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from .stripe_payment import create_stripe_payment_intent, handle_stripe_payment_success
import json
import stripe


def send_owner_notification(transaction, status):
    """Helper function to send notification to owner"""
    try:
        pass  # Add your logic here
    except Exception as e:
        return Response({"error": str(e)}, status=500)
        pass  # Add your logic here
    except Exception as e:
        return Response({"error": str(e)}, status=500)
        if isinstance(transaction, CarTransaction):
            item = transaction.car
            item_type = 'car'
        else:
            item = transaction.house
            item_type = 'house'

        context = {
            'owner_name': transaction.seller.username,
            'item_type': item_type,
            'renter_name': transaction.buyer.username,
            'renter_phone': transaction.buyer.phone_number,
            'renter_email': transaction.buyer.email,
            'status': status,
            'start_date': transaction.reservation.start_date.strftime('%Y-%m-%d'),
            'end_date': transaction.reservation.end_date.strftime('%Y-%m-%d')
        }

        html_message = render_to_string('email/owner_notification.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=f'Rental Status Update: {status}',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[transaction.seller.email],
            html_message=html_message
        )
    except Exception as e:
        print(f"Error sending owner notification: {str(e)}")

def send_cash_payment_confirmation(request, transaction):
    """Helper function to send cash payment confirmation"""
    try:
        if isinstance(transaction, CarTransaction):
            item = transaction.car
            item_type = 'car'
        else:
            item = transaction.house
            item_type = 'house'

        context = {
            'owner_name': transaction.seller.username,
            'item_type': item_type,
            'renter_name': transaction.buyer.username,
            'renter_phone': transaction.buyer.phone_number,
            'renter_email': transaction.buyer.email,
            'amount': transaction.amount,
            'payment_date': timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        html_message = render_to_string('email/cash_payment_confirmation.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=f'Cash Payment Confirmation for {item_type} rental',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[transaction.seller.email],
            html_message=html_message
        )
    except Exception as e:
        print(f"Error sending cash payment confirmation: {str(e)}")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request, transaction_id):
    """Initiate a payment for a transaction"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.buyer != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Check if transaction is already paid
        if transaction.status == 'paid':
            return Response({"error": "Transaction already paid"}, status=400)

        # Here you would implement your payment gateway integration
        # For now, we'll just return a success response
        return Response({
            "success": True,
            "message": "Payment initiated successfully",
            "transaction_id": str(transaction.id)
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request, transaction_id):
    """Check the status of a payment"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.buyer != request.user and transaction.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Return current status
        return Response({
            "transaction_id": str(transaction.id),
            "status": transaction.status,
            "payment_status": transaction.payment_status
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

class CarTransactionViewSet(viewsets.ModelViewSet):
    queryset = CarTransaction.objects.all()
    serializer_class = CarTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class HouseTransactionViewSet(viewsets.ModelViewSet):
    queryset = HouseTransaction.objects.all()
    serializer_class = HouseTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class CarReservationViewSet(viewsets.ModelViewSet):
    queryset = CarReservation.objects.all()
    serializer_class = CarReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        if reservation.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        reservation.status = 'canceled'
        reservation.save()
        return Response({"status": "canceled"})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        reservation = self.get_object()
        if reservation.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        reservation.status = 'completed'
        reservation.save()
        return Response({"status": "completed"})

class HouseReservationViewSet(viewsets.ModelViewSet):
    queryset = HouseReservation.objects.all()
    serializer_class = HouseReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        if reservation.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        reservation.status = 'canceled'
        reservation.save()
        return Response({"status": "canceled"})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        reservation = self.get_object()
        if reservation.user != request.user:
            return Response({"error": "Not authorized"}, status=403)
        reservation.status = 'completed'
        reservation.save()
        return Response({"status": "completed"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_rental_confirmation_email(request, transaction_id):
    """Send rental confirmation email"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.buyer != request.user and transaction.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Send confirmation email
        send_owner_notification(transaction, 'confirmed')
        return Response({"success": True, "message": "Confirmation email sent"})

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_rental(request, transaction_id):
    """Confirm a rental transaction and capture the payment"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Capture the payment
        stripe.PaymentIntent.capture(transaction.payment_reference)

        # Update transaction status
        transaction.status = 'confirmed'
        transaction.payment_status = 'completed'
        transaction.save()

        # Send confirmation email
        send_owner_notification(transaction, 'confirmed')
        return Response({"success": True, "message": "Rental confirmed and payment captured"})

    except stripe.error.StripeError as e:
        return Response({"error": f"Stripe error: {str(e)}"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_rental(request, transaction_id):
    """Cancel a rental transaction"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.buyer != request.user and transaction.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Update transaction status
        transaction.status = 'canceled'
        transaction.save()

        # Send cancellation email
        send_owner_notification(transaction, 'canceled')
        return Response({"success": True, "message": "Rental canceled"})

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_rental_status(request, transaction_id):
    """Check the status of a rental transaction"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.buyer != request.user and transaction.seller != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Return current status
        return Response({
            "success": True,
            "status": transaction.status,
            "message": f"Current status: {transaction.status}"
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_stripe_payment(request, transaction_id):
    """Create a Stripe payment intent without capturing the payment"""
    try:
        # Get transaction
        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
            item = transaction.car
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
                item = transaction.house
            except HouseTransaction.DoesNotExist:
                return Response({"error": "Transaction not found"}, status=404)

        # Check if user is authorized
        if transaction.buyer != request.user:
            return Response({"error": "Not authorized"}, status=403)

        # Check if transaction is already paid
        if transaction.status in ['completed', 'confirmed']:
            return Response({"error": "Transaction already completed or confirmed"}, status=400)

        # Calculate the amount based on price and rental duration
        if transaction.reservation:
            start_date = transaction.reservation.start_date
            end_date = transaction.reservation.end_date
            rental_days = (end_date - start_date).days
            if rental_days <= 0:
                return Response({"error": "Invalid rental duration"}, status=400)
            amount_dzd = item.price * rental_days
        else:
            return Response({"error": "Reservation details are missing"}, status=400)

        # Convert DZD to EUR
        conversion_rate = 0.0068  # Example conversion rate (1 DZD = 0.0068 EUR)
        amount_eur = round(amount_dzd * conversion_rate, 2)

        # Update payment_details in the transaction
        currency = 'eur'  # Default currency for Mastercard Stripe payments
        transaction.payment_details = {
            "amount_dzd": amount_dzd,
            "amount_eur": amount_eur,
            "currency": currency
        }
        transaction.save()

        # Create payment intent without capturing
        intent = create_stripe_payment_intent(amount_eur, currency, capture_method='manual')

        # Notify the owner
        send_owner_notification(transaction, 'pending')

        # Return client_secret and payment_intent_id for frontend
        return Response({
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """Verify the payment status using the payment_intent_id"""
    try:
        payment_intent_id = request.data.get('payment_intent_id')
        if not payment_intent_id:
            return Response({"error": "PaymentIntent ID is required"}, status=400)

        # Retrieve the PaymentIntent from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        # Check the status of the PaymentIntent
        if payment_intent.status == 'succeeded':
            # Update transaction status
            transaction_id = payment_intent.metadata.get('transaction_id')
            transaction = CarTransaction.objects.get(id=transaction_id)  # Adjust for HouseTransaction if needed
            transaction.status = 'completed'
            transaction.payment_status = 'completed'
            transaction.payment_reference = payment_intent_id
            transaction.save()

            return Response({"success": True, "message": "Payment verified and transaction updated"})

        return Response({"error": "Payment not completed", "status": payment_intent.status}, status=400)

    except stripe.error.StripeError as e:
        return Response({"error": f"Stripe error: {str(e)}"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refund_payment(request):
    """Refund a payment using the payment_intent_id"""
    try:
        payment_intent_id = request.data.get('payment_intent_id')
        if not payment_intent_id:
            return Response({"error": "PaymentIntent ID is required"}, status=400)

        # Issue a refund
        stripe.Refund.create(payment_intent=payment_intent_id)

        # Update transaction status
        transaction = CarTransaction.objects.get(payment_reference=payment_intent_id)  # Adjust for HouseTransaction if needed
        transaction.status = 'cancelled'
        transaction.payment_status = 'refunded'
        transaction.save()

        return Response({"success": True, "message": "Payment refunded successfully"})

    except stripe.error.StripeError as e:
        return Response({"error": f"Stripe error: {str(e)}"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@csrf_exempt
@require_POST
def stripe_webhook(request):
    """Handle Stripe webhook events"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({"error": "Invalid signature"}, status=400)

    if event.type == 'payment_intent.payment_failed':
        payment_intent = event.data.object
        transaction_id = payment_intent.metadata.get('transaction_id')

        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return JsonResponse({"error": "Transaction not found"}, status=404)

        # Mark transaction as failed
        transaction.status = 'failed'
        transaction.payment_status = 'failed'
        transaction.save()

        return JsonResponse({"status": "failed"})

    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object
        transaction_id = payment_intent.metadata.get('transaction_id')

        try:
            transaction = CarTransaction.objects.get(id=transaction_id)
        except CarTransaction.DoesNotExist:
            try:
                transaction = HouseTransaction.objects.get(id=transaction_id)
            except HouseTransaction.DoesNotExist:
                return JsonResponse({"error": "Transaction not found"}, status=404)

        # Mark transaction as pending confirmation
        transaction.status = 'pending_confirmation'
        transaction.payment_status = 'authorized'
        transaction.payment_reference = payment_intent.id
        transaction.save()

        return JsonResponse({"status": "pending_confirmation"})

    return JsonResponse({"status": "received"})


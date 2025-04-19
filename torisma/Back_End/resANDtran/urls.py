from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CarTransactionViewSet, HouseTransactionViewSet,
    CarReservationViewSet, HouseReservationViewSet,
    create_stripe_payment, stripe_webhook, verify_payment,
    send_rental_confirmation_email, confirm_rental, cancel_rental,
    check_rental_status, initiate_payment, check_payment_status
)
from .webhooks import stripe_webhook_handler

# Create separate routers for transactions and reservations
transactions_router = DefaultRouter()
reservations_router = DefaultRouter()

# Register transaction viewsets
transactions_router.register(r'car-transactions', CarTransactionViewSet)
transactions_router.register(r'house-transactions', HouseTransactionViewSet)

# Register reservation viewsets
reservations_router.register(r'car-reservations', CarReservationViewSet)
reservations_router.register(r'house-reservations', HouseReservationViewSet)

urlpatterns = [
    # Transaction and reservation endpoints
    path('transactions/', include(transactions_router.urls)),
    path('reservations/', include(reservations_router.urls)),

    # Rental confirmation endpoints
    path('rentals/<uuid:transaction_id>/send-confirmation/', send_rental_confirmation_email, name='send_rental_confirmation'),
    path('rentals/<uuid:transaction_id>/confirm/', confirm_rental, name='confirm_rental'),
    path('rentals/<uuid:transaction_id>/cancel/', cancel_rental, name='cancel_rental'),
    path('rentals/<uuid:transaction_id>/status/', check_rental_status, name='check_rental_status'),

    # Payment endpoints
    path('cash-payment/<uuid:transaction_id>/initiate/', initiate_payment, name='initiate_cash_payment'),
    path('cash-payment/<uuid:transaction_id>/confirm/', confirm_rental, name='confirm_cash_payment'),
    path('stripe/create-payment/<uuid:transaction_id>/', create_stripe_payment, name='create_stripe_payment'),
    path('stripe/verify-payment/', verify_payment, name='verify_payment'),
    path('stripe/webhook/', stripe_webhook, name='stripe_webhook'),

    # Payment status check
    path('payment/<uuid:transaction_id>/status/', check_payment_status, name='check_payment_status'),
    path('webhooks/stripe/', stripe_webhook_handler, name='stripe-webhook'),
]


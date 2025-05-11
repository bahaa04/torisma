from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CarReservationViewSet,
    HouseReservationViewSet,
    verify_payment,
    stripe_webhook_handler,
    initiate_cash_payment,
    confirm_cash_payment,
    create_stripe_payment,
    check_payment_status,
    send_cash_verification_email
)

router = DefaultRouter()
router.register(r'car-reservations', CarReservationViewSet, basename='carreservation')
router.register(r'house-reservations', HouseReservationViewSet, basename='housereservation')

urlpatterns = [
    path('', include(router.urls)),
    path('car-reservations/<uuid:pk>/process_payment/', CarReservationViewSet.as_view({'post': 'process_payment'}), name='carreservation-process-payment'),

    # Cash payment endpoints
    path('car-reservations/<uuid:reservation_id>/cash/initiate/', initiate_cash_payment, name='car-cash-payment-initiate'),
    path('car-reservations/<uuid:reservation_id>/cash/verify/', send_cash_verification_email, name='car-cash-verification'),
    path('car-reservations/<uuid:reservation_id>/cash/confirm/', confirm_cash_payment, name='car-cash-payment-confirm'),
    path('house-reservations/<uuid:reservation_id>/cash/initiate/', initiate_cash_payment, name='house-cash-payment-initiate'),
    path('house-reservations/<uuid:reservation_id>/cash/verify/', send_cash_verification_email, name='house-cash-verification'),
    path('house-reservations/<uuid:reservation_id>/cash/confirm/', confirm_cash_payment, name='house-cash-payment-confirm'),

    # Stripe payment endpoints
    path('car-reservations/<uuid:reservation_id>/stripe/create/', create_stripe_payment, name='car-stripe-payment-create'),
    path('house-reservations/<uuid:reservation_id>/stripe/create/', create_stripe_payment, name='house-stripe-payment-create'),
    path('payments/stripe/verify/', verify_payment, name='stripe-payment-verify'),
    path('payments/stripe/webhook/', stripe_webhook_handler, name='stripe-webhook'),

    # Payment status endpoints
    path('car-reservations/<uuid:reservation_id>/status/', check_payment_status, name='car-payment-status'),
    path('house-reservations/<uuid:reservation_id>/status/', check_payment_status, name='house-payment-status'),
]


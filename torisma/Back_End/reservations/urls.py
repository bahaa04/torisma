from django.urls import path
from .views import (
    CarReservationViewSet,
    HouseReservationViewSet,
    check_availability,
    process_payment_result,
    confirm_cash_payment,
    cancel_reservation,
    get_reservation_details,
    stripe_webhook_handler
)

urlpatterns = [
    # Reservation endpoints
    path('car-reservations/', CarReservationViewSet.as_view({
        'get': 'list', 
        'post': 'create'
    }), name='car-reservation-list'),
    
    path('house-reservations/', HouseReservationViewSet.as_view({
        'get': 'list', 
        'post': 'create'
    }), name='house-reservation-list'),
    
    path('car-reservations/<uuid:pk>/', CarReservationViewSet.as_view({
        'get': 'retrieve', 
        'put': 'update', 
        'delete': 'destroy'
    }), name='car-reservation-detail'),
    
    path('house-reservations/<uuid:pk>/', HouseReservationViewSet.as_view({
        'get': 'retrieve', 
        'put': 'update', 
        'delete': 'destroy'
    }), name='house-reservation-detail'),
    
    # Payment processing
    path('process-payment-result/', process_payment_result, name='process-payment-result'),
    
    # Cash payment confirmation
    path('car-reservations/<uuid:reservation_id>/confirm/', 
         confirm_cash_payment, 
         name='confirm-car-reservation'),
    
    path('house-reservations/<uuid:reservation_id>/confirm/', 
         confirm_cash_payment, 
         name='confirm-house-reservation'),
    
    # Reservation management
    path('car-reservations/<uuid:reservation_id>/cancel/', 
         cancel_reservation, 
         name='cancel-car-reservation'),
    
    path('house-reservations/<uuid:reservation_id>/cancel/', 
         cancel_reservation, 
         name='cancel-house-reservation'),
    
    # Payment page data
    path('get-reservation-details/<uuid:reservation_id>/', 
         get_reservation_details, 
         name='get-reservation-details'),
    
    # Availability check
    path('check-availability/', check_availability, name='check-availability'),
    
    # Stripe webhook
    path('stripe/webhook/', stripe_webhook_handler, name='stripe-webhook'),
]
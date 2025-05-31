from django.utils import timezone
from datetime import timedelta
from .models import CarReservation, HouseReservation

def check_completed_reservations():
    """
    Check for reservations that have passed their end date and update their status to 'completed'
    and update the car/house status back to 'available'
    """
    # Get current time
    now = timezone.now()
    
    # Check car reservations
    completed_car_reservations = CarReservation.objects.filter(
        end_date__lt=now,  # End date is in the past
        status='confirmed'  # Status is still confirmed
    )
    
    for reservation in completed_car_reservations:
        # Update reservation status
        reservation.status = 'completed'
        reservation.save()
        
        # Update car status
        car = reservation.car
        car.status = 'available'
        car.save()
    
    # Check house reservations
    completed_house_reservations = HouseReservation.objects.filter(
        end_date__lt=now,  # End date is in the past
        status='confirmed'  # Status is still confirmed
    )
    
    for reservation in completed_house_reservations:
        # Update reservation status
        reservation.status = 'completed'
        reservation.save()
        
        # Update house status
        house = reservation.house
        house.status = 'available'
        house.save()

def check_expired_pending_reservations():
    """
    Check for pending reservations where the confirmation link has expired
    (more than 1 day after start date) and cancel them
    """
    # Get current time
    now = timezone.now()
    
    # Find expired car reservations
    expired_car_reservations = CarReservation.objects.filter(
        start_date__lt=now - timedelta(days=1),  # Start date was more than a day ago
        status='pending',  # Status is still pending
        payment_status='pending'  # Payment is still pending
    )
    
    for reservation in expired_car_reservations:
        # Update reservation status to cancelled
        reservation.status = 'cancelled'
        reservation.payment_status = 'cancelled'
        reservation.save()
        
        # Return car to available
        car = reservation.car
        car.status = 'available'
        car.save()
    
    # Find expired house reservations
    expired_house_reservations = HouseReservation.objects.filter(
        start_date__lt=now - timedelta(days=1),  # Start date was more than a day ago
        status='pending'  # Status is still pending
    )
    
    for reservation in expired_house_reservations:
        # Update reservation status to cancelled
        reservation.status = 'cancelled'
        reservation.save()
        
        # Return house to available
        house = reservation.house
        house.status = 'available'
        house.save()

def complete_finished_reservations():
    """Complete reservations that have passed their end date"""
    now = timezone.now()

    # Handle car reservations
    finished_car_reservations = CarReservation.objects.filter(
        end_date__lt=now,
        status='confirmed'
    )
    for reservation in finished_car_reservations:
        reservation.status = 'completed'
        reservation.save()
        
        car = reservation.car
        car.status = 'available'
        car.save()

    # Handle house reservations
    finished_house_reservations = HouseReservation.objects.filter(
        end_date__lt=now,
        status='confirmed'
    )
    for reservation in finished_house_reservations:
        reservation.status = 'completed'
        reservation.save()
        
        house = reservation.house
        house.status = 'available'
        house.save()
from uuid import uuid4

from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.utils import timezone
User = get_user_model()
STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
    ('failed', 'Failed'),
]

payment_choices = [
    ('cash', 'Cash'),
    ('mastercard', 'Mastercard'),
]

class MastercardPayment(models.Model):  # Renamed from DhahabiyaPayment
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    card_number = models.CharField(max_length=16)
    cardholder_name = models.CharField(max_length=100)
    expiration_date = models.DateField()
    postal_code = models.CharField(max_length=5)
    phone_number = models.CharField(max_length=15)  # Phone number associated with the card
    validation_code = models.CharField(max_length=6, null=True, blank=True)
    validation_code_expiry = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Mastercard Payment - {self.cardholder_name}"

class StripePayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='usd')
    status = models.CharField(max_length=50, default='pending')  # Updated to track webhook status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Stripe Payment - {self.stripe_payment_intent_id}"

class CarTransaction(models.Model):
    CONFIRMATION_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    car = models.ForeignKey(
        'listings.Car',  # Use app_label.ModelName to avoid circular imports
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='car_purchases')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='car_sales', null=True, blank=True)
    reservation = models.ForeignKey('CarReservation', on_delete=models.CASCADE, related_name='transactions', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confirmation_status = models.CharField(max_length=20, choices=CONFIRMATION_CHOICES, default='pending')
    payment_reference = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50, choices=payment_choices, default='cash')
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_details = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    mastercard_payment = models.ForeignKey(MastercardPayment, on_delete=models.SET_NULL, null=True, blank=True, related_name='car_transactions')  # Updated field name
    stripe_payment = models.ForeignKey(StripePayment, on_delete=models.SET_NULL, null=True, blank=True, related_name='car_transactions')

    def __str__(self):
        return f"{self.car.manufacture} {self.car.model} - {self.buyer.username}"

class HouseTransaction(models.Model):
    CONFIRMATION_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    house = models.ForeignKey(
        'listings.House',  # Use app_label.ModelName to avoid circular imports
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='house_purchases')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='house_sales', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confirmation_status = models.CharField(max_length=20, choices=CONFIRMATION_CHOICES, default='pending')
    payment_reference = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50, choices=payment_choices, default='cash')
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_details = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    mastercard_payment = models.ForeignKey(MastercardPayment, on_delete=models.SET_NULL, null=True, blank=True, related_name='house_transactions')  # Updated field name
    stripe_payment = models.ForeignKey(StripePayment, on_delete=models.SET_NULL, null=True, blank=True, related_name='house_transactions')

    def __str__(self):
        return f"{self.house.title} - {self.buyer.username}"

class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    reservation_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(
        max_length=24,  # Increased from the previous value
        choices=STATUS_CHOICES,
        default='available'
    )

class CarReservation(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    car = models.ForeignKey('listings.Car', on_delete=models.CASCADE)  # Updated to avoid circular imports
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Reservation by {self.user.username} for {self.car.manufacture} {self.car.model}'

class HouseReservation(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    house = models.ForeignKey('listings.House', on_delete=models.CASCADE)  # Updated to avoid circular imports

    def __str__(self):
        return f'Reservation by {self.user.username} for {self.house.name}'

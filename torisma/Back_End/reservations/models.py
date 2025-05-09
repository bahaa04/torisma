from uuid import uuid4
import django
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled')
]

PAYMENT_METHOD_CHOICES = [
    ('cash', 'Cash'),
    ('mastercard', 'Mastercard')
]

PAYMENT_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
    ('failed', 'Failed')
]

class MastercardPayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    card_number = models.CharField(max_length=16)
    cardholder_name = models.CharField(max_length=100)
    expiration_date = models.DateField()
    postal_code = models.CharField(max_length=5)
    phone_number = models.CharField(max_length=15)
    validation_code = models.CharField(max_length=6, null=True, blank=True)
    validation_code_expiry = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    status = models.CharField(max_length=50,choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Mastercard Payment - {self.cardholder_name}"

class StripePayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='usd')
    status = models.CharField(max_length=50,choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Stripe Payment - {self.stripe_payment_intent_id}"

class CarReservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    car = models.ForeignKey('listings.Car', on_delete=models.CASCADE)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_details = models.JSONField(null=True, blank=True)
    payment_reference = models.CharField(max_length=255, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Reservation by {self.user.username} for {self.car.manufacture} {self.car.model}'

class HouseReservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    house = models.ForeignKey('listings.House', on_delete=models.CASCADE)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now) # Temporary default

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Reservation by {self.user.username} for {self.house.title}'

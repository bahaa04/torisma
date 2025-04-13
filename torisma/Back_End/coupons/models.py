# coupons/models.py

from django.db import models
from django.utils import timezone

class Coupon(models.Model):
    code = models.CharField(max_length=100, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)  # For example, 10.00 for 10% discount
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    valid_from = models.DateTimeField(default=timezone.now)  # When the coupon starts being valid
    valid_until = models.DateTimeField(default=timezone.now)  # When the coupon expires

    def __str__(self):
        return self.code

    def is_valid(self):
        """
        Check if the coupon is currently valid based on the time range.
        """
        current_time = timezone.now()
        return self.is_active and self.valid_from <= current_time <= self.valid_until


# Create your models here.

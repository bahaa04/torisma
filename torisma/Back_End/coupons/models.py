from django.db import models
from django.utils import timezone

class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percentage = models.PositiveIntegerField()  # example: 20 means 20%
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    active = models.BooleanField(default=True)

    @staticmethod
    def deactivate_expired_coupons():
        # Deactivate all expired coupons
        now = timezone.now()
        Coupon.objects.filter(valid_until__lt=now, active=True).update(active=False)

    def save(self, *args, **kwargs):
        # Automatically deactivate the coupon if it has expired
        if self.valid_until < timezone.now():
            self.active = False  # Set coupon as inactive
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.discount_percentage}%"


# Create your models here.

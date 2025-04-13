# coupons/serializers.py

from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount', 'is_active', 'created_at', 'valid_from', 'valid_until']

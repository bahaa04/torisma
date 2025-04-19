from rest_framework import serializers
from .models import Coupon
from django.utils import timezone

class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()

    class Meta:
        model = Coupon
        fields = [
            'id',
            'code',
            'discount_percentage',
            'valid_from',
            'valid_to',
            'description',
            'is_active',
            'is_valid',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_is_valid(self, obj):
        """
        Check if the coupon is currently valid (active and within valid time range).
        """
        now = timezone.now()
        return obj.is_active and obj.valid_from <= now <= obj.valid_to

class CouponCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'code',
            'discount_percentage',
            'valid_from',
            'valid_to',
            'description'
        ]

class CouponUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'discount_percentage',
            'valid_from',
            'valid_to',
            'description',
            'is_active'
        ]
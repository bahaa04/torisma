from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
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
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

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
from rest_framework import serializers
from .models import CarReservation, HouseReservation
from django.utils import timezone
from coupons.models import Coupon

class CarReservationSerializer(serializers.ModelSerializer):
    coupon_code = serializers.CharField(required=False, write_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CarReservation
        fields = ['id', 'car', 'start_date', 'end_date', 'status', 'payment_method', 
                 'payment_status', 'payment_details', 'total_price', 'coupon_code', 'discounted_price']
        read_only_fields = ['payment_status', 'status', 'discounted_price']

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        if data['start_date'] < timezone.now():
            raise serializers.ValidationError("Start date cannot be in the past")
        
        # Calculate base total price
        days = (data['end_date'] - data['start_date']).days
        total_price = data['car'].price * days

        # Apply coupon if provided
        coupon_code = data.pop('coupon_code', None)
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, active=True)
                now = timezone.now()
                if coupon.valid_from <= now <= coupon.valid_to:
                    discount = total_price * (coupon.discount_percentage / 100)
                    data['total_price'] = total_price - discount
                    data['payment_details'] = {
                        'original_price': str(total_price),
                        'discount_percentage': coupon.discount_percentage,
                        'discount_amount': str(discount),
                        'coupon_code': coupon_code
                    }
                else:
                    raise serializers.ValidationError("Coupon has expired")
            except Coupon.DoesNotExist:
                raise serializers.ValidationError("Invalid coupon code")
        else:
            data['total_price'] = total_price
        
        return data

class HouseReservationSerializer(serializers.ModelSerializer):
    coupon_code = serializers.CharField(required=False, write_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = HouseReservation
        fields = ['id', 'house', 'start_date', 'end_date', 'status', 'payment_method',
                 'payment_status', 'payment_details', 'total_price', 'coupon_code', 'discounted_price']
        read_only_fields = ['payment_status', 'status', 'discounted_price']

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        if data['start_date'] < timezone.now():
            raise serializers.ValidationError("Start date cannot be in the past")
        
        # Calculate base total price
        days = (data['end_date'] - data['start_date']).days
        total_price = data['house'].price * days

        # Apply coupon if provided
        coupon_code = data.pop('coupon_code', None)
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, active=True)
                now = timezone.now()
                if coupon.valid_from <= now <= coupon.valid_to:
                    discount = total_price * (coupon.discount_percentage / 100)
                    data['total_price'] = total_price - discount
                    data['payment_details'] = {
                        'original_price': str(total_price),
                        'discount_percentage': coupon.discount_percentage,
                        'discount_amount': str(discount),
                        'coupon_code': coupon_code
                    }
                else:
                    raise serializers.ValidationError("Coupon has expired")
            except Coupon.DoesNotExist:
                raise serializers.ValidationError("Invalid coupon code")
        else:
            data['total_price'] = total_price
        
        return data

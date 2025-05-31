from rest_framework import serializers
from .models import CarReservation, HouseReservation
from django.utils import timezone
from coupons.models import Coupon

class CarReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarReservation
        fields = [
            'id', 'user', 'car', 'start_date', 'end_date', 
            'status', 'payment_method', 'payment_status',
            'total_price'
        ]
        read_only_fields = ['status', 'payment_status', 'total_price']

    def create(self, validated_data):
        # Calculate total price before saving
        days = (validated_data['end_date'] - validated_data['start_date']).days
        car_price = validated_data['car'].price
        validated_data['total_price'] = days * car_price
        return super().create(validated_data)

    def validate(self, data):
        if 'car' in data and data['car'].owner == self.context['request'].user:
            raise serializers.ValidationError("You cannot reserve your own car")

        if not data.get('user'):
            data['user'] = self.context['request'].user

        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        if data['start_date'] < timezone.now():
            raise serializers.ValidationError("Start date cannot be in the past")
        
        return data

class HouseReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseReservation
        fields = [
            'id', 'user', 'house', 'start_date', 'end_date', 
            'status', 'payment_method', 'payment_status',
            'total_price'
        ]
        read_only_fields = ['status', 'payment_status', 'total_price']

    def create(self, validated_data):
        # Calculate total price based on number of days and house price
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        days = (end_date - start_date).days
        house_price = validated_data['house'].price
        total_price = days * house_price

        # Set initial status and payment status
        reservation = HouseReservation.objects.create(
            **validated_data,
            status='pending',
            payment_status='pending',
            total_price=total_price
        )
        return reservation

    def validate(self, data):
        if 'house' in data and data['house'].owner == self.context['request'].user:
            raise serializers.ValidationError("You cannot reserve your own house")

        if not data.get('user'):
            data['user'] = self.context['request'].user

        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        
        return data

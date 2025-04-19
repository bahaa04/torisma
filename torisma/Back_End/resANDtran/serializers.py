from rest_framework import serializers
from .models import CarReservation, HouseReservation, CarTransaction, HouseTransaction

class CarReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarReservation
        fields = ['id', 'user', 'car', 'start_date', 'end_date', 'status', 'created_at']
        read_only_fields = ['user', 'created_at']

class HouseReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseReservation
        fields = ['id', 'user', 'House', 'reservation_date', 'start_date', 'end_date', 'status', 'price', 'transaction']

class CarTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarTransaction
        fields = ['id', 'car', 'reservation', 'status', 'created_at', 'payment_method', 'payment_status']
        read_only_fields = ['id', 'buyer', 'created_at']

class HouseTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseTransaction
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']

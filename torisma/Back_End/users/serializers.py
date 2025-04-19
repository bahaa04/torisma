from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from listings.models import Car, House
from listings.serializers import CarSerializer, HouseSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})  # Make password invisible

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'phone_number', 'gender', 'password', 
            'identification_type', 'identification_image'  # Include identification fields
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            gender=validated_data.get('gender', None),
            identification_type=validated_data.get('identification_type', ''),  # Add identification_type
            identification_image=validated_data.get('identification_image', None)  # Add identification_image
        )
        user.role = 'customer'  # Automatically set role to 'customer'
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if user.is_banned:
            raise AuthenticationFailed("This account is banned.")  # Explicitly deny token issuance

        return data

class UserProfileSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    cars = CarSerializer(many=True)
    houses = HouseSerializer(many=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'phone_number', 'gender', 'profile_image', 
            'identification_type', 'identification_image',
            'current_password', 'new_password',  # Add password fields
            'cars', 'houses'  # Add user's properties
        ]
        read_only_fields = ['id', 'email', 'username']

    def validate(self, data):
        # If password change is requested
        if 'new_password' in data:
            if 'current_password' not in data:
                raise serializers.ValidationError({"current_password": "Current password is required to change password"})
            
            # Verify current password
            if not self.instance.check_password(data['current_password']):
                raise serializers.ValidationError({"current_password": "Current password is incorrect"})
            
            # Remove current_password from data as it's not a model field
            data.pop('current_password')
        
        return data

    def update(self, instance, validated_data):
        # Handle password change if new_password is provided
        if 'new_password' in validated_data:
            instance.set_password(validated_data.pop('new_password'))
        
        # Handle cars update
        if 'cars' in validated_data:
            cars_data = validated_data.pop('cars')
            # Delete existing cars not in the new data
            existing_cars = {car.id: car for car in instance.cars.all()}
            for car_data in cars_data:
                if 'id' in car_data and car_data['id'] in existing_cars:
                    car = existing_cars[car_data['id']]
                    for attr, value in car_data.items():
                        setattr(car, attr, value)
                    car.save()
                else:
                    Car.objects.create(owner=instance, **car_data)
            # Delete cars not in the new data
            for car_id, car in existing_cars.items():
                if not any(car_data.get('id') == car_id for car_data in cars_data):
                    car.delete()

        # Handle houses update
        if 'houses' in validated_data:
            houses_data = validated_data.pop('houses')
            # Delete existing houses not in the new data
            existing_houses = {house.id: house for house in instance.houses.all()}
            for house_data in houses_data:
                if 'id' in house_data and house_data['id'] in existing_houses:
                    house = existing_houses[house_data['id']]
                    for attr, value in house_data.items():
                        setattr(house, attr, value)
                    house.save()
                else:
                    House.objects.create(owner=instance, **house_data)
            # Delete houses not in the new data
            for house_id, house in existing_houses.items():
                if not any(house_data.get('id') == house_id for house_data in houses_data):
                    house.delete()
        
        # Update other fields
        return super().update(instance, validated_data)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from listings.models import Car, House  # Import the models
from listings.serializers import CarSerializer, HouseSerializer  # Import the serializers

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
    profile_image = serializers.ImageField(required=False)
    user_cars = CarSerializer(source='cars', many=True, read_only=True)
    user_houses = HouseSerializer(source='houses', many=True, read_only=True)
    
    class Meta:
        model = get_user_model()
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'phone_number', 'gender', 'profile_image', 'date_joined',
            'user_cars', 'user_houses'
        ]
        read_only_fields = ['id', 'email', 'date_joined', 'gender', 'user_cars', 'user_houses']

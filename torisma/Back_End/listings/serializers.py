from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Car, House, Favorite, CarPhotos, HousePhotos, Wilaya, WilayaPhotos, WilayaPhoto, wilayas
import datetime
from reservations.models import CarReservation, HouseReservation  # Updated import path

# Car Photos Serializer
class CarPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhotos
        fields = ['id', 'photo']

# House Photos Serializer
class HousePhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousePhotos
        fields = ['id', 'photo']

# Wilaya Photos Serializer
class WilayaPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = WilayaPhotos
        fields = ['id', 'wilaya_name', 'photo', 'uploaded_at']

# Car Serializer
class CarSerializer(serializers.ModelSerializer):
    photos = CarPhotosSerializer(many=True, read_only=True)
    wilaya = serializers.ChoiceField(choices=wilayas)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Car
        fields = ['id', 'owner', 'description', 'price', 'location', 'wilaya',
                 'status', 'manufacture', 'model', 'manufacturing_year',
                 'seats', 'fuel_type', 'created_at', 'photos']
        read_only_fields = ['owner']

# House Serializer
class HouseSerializer(serializers.ModelSerializer):
    photos = HousePhotosSerializer(many=True, read_only=True)
    wilaya = serializers.ChoiceField(choices=wilayas, required=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    city = serializers.CharField(required=True)
    gps_location = serializers.URLField(required=True)
    description = serializers.CharField(required=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    has_parking = serializers.BooleanField(required=True)
    has_wifi = serializers.BooleanField(required=True)
    furnished = serializers.BooleanField(required=True)
    rooms = serializers.IntegerField(min_value=1, required=True)

    class Meta:
        model = House
        fields = ['id', 'owner', 'description', 'price', 'wilaya',
                 'city', 'gps_location', 'status', 'furnished', 
                 'has_parking', 'has_wifi', 'created_at', 'photos', 'rooms']
        read_only_fields = ['id', 'owner', 'created_at']

    def validate(self, data):
        """
        Extra validation for house data.
        """
        if not data.get('city'):
            raise serializers.ValidationError("City is required")
        if not data.get('gps_location'):
            raise serializers.ValidationError("GPS location link is required")
        if not data.get('description'):
            raise serializers.ValidationError("Description is required")
        return data

# Favorite Serializer
class FavoriteSerializer(serializers.ModelSerializer):
    item_type = serializers.ChoiceField(choices=['car', 'house'], write_only=True)
    item_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'item_type', 'item_id', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        item_type = validated_data.pop('item_type')
        item_id = validated_data.pop('item_id')

        # Get the correct model based on item_type
        if item_type == 'car':
            model = Car
        else:
            model = House

        # Get the content type
        content_type = ContentType.objects.get_for_model(model)
        
        # Try to get the item
        try:
            item = model.objects.get(id=item_id)
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{item_type} with id {item_id} does not exist")

        # Create the favorite
        favorite = Favorite.objects.create(
            user=user,
            content_type=content_type,
            object_id=item.id
        )
        
        return favorite

class WilayaPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WilayaPhoto
        fields = ['id', 'image', 'uploaded_at']

# Wilaya Serializer
class WilayaSerializer(serializers.ModelSerializer):
    photos = WilayaPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Wilaya
        fields = ['id', 'name', 'photos']
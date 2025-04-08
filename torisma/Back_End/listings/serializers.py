from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Car, HouseHotel, Favorite
import datetime

# Car Serializer
class CarSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    manufacturing_year = serializers.IntegerField()
    is_favorised = serializers.SerializerMethodField()

    def validate_manufacturing_year(self, value):
        current_year = datetime.date.today().year
        if value is not None and (value < 1900 or value > current_year):
            raise serializers.ValidationError(f"Year must be between 1900 and {current_year}.")
        return value

    def get_is_favorised(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.favorised_by.filter(user=user).exists()
        return False

    class Meta:
        model = Car
        fields = [
            'id',
            'owner',
            'description',
            'price',
            'currency',
            'location',
            'la_wilaya',
            'is_active',
            'created_at',
            'updated_at',
            'manufacture',
            'model',
            'manufacturing_year',
            'seats',
            'fuel_type',
            'is_favorised'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'is_favorised']

# HouseHotel Serializer
class HouseHotelSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    is_favorised = serializers.SerializerMethodField()

    def get_is_favorised(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.favorised_by.filter(user=user).exists()
        return False

    class Meta:
        model = HouseHotel
        fields = [
            'id',
            'owner',
            'description',
            'price',
            'currency',
            'location',
            'la_wilaya',
            'is_active',
            'created_at',
            'updated_at',
            'number_of_rooms',
            'has_parking',
            'has_wifi',
            'is_furnished',
            'type',
            'is_favorised'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'is_favorised']

# Favorite Serializer
class FavoriteSerializer(serializers.ModelSerializer):
    item_type = serializers.ChoiceField(choices=['car', 'house_hotel'], write_only=True)
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
            model = HouseHotel

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
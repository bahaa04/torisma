from rest_framework import serializers
from .models import CarRating, HouseRating

class CarRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarRating
        fields = ['car_id', 'average', 'rating_count', 'updated_at']
        read_only_fields = ['average', 'rating_count', 'updated_at']

class HouseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseRating
        fields = ['house_id', 'average', 'rating_count', 'updated_at']
        read_only_fields = ['average', 'rating_count', 'updated_at']

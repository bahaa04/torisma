from rest_framework import serializers
from .models import CarRating, HouseRating

class CarRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CarRating
        fields = ('car_id', 'total_score', 'rating_count', 'average', 'updated_at')

class HouseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = HouseRating
        fields = ('house_id', 'total_score', 'rating_count', 'average', 'updated_at')

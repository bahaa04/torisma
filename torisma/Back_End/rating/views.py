from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import CarRating, HouseRating, UserCarRating, UserHouseRating
from .serializers import CarRatingSerializer, HouseRatingSerializer
from listings.models import Car, House

def validate_rating_request(request):
    """
    Validates rating request data and returns (id, score) or (None, error_response)
    """
    try:
        # Try to get data from request.data first (handles both JSON and form data)
        if request.data:
            data = request.data
        # If no data in request.data, try to parse the body
        elif request.body and request.body.strip():
            data = JSONParser().parse(request)
        else:
            return None, Response({"error": "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not isinstance(data, dict):
            return None, Response({"error": "Invalid data format"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return None, Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Get the appropriate ID field based on the request path
    id_field = None
    if 'car' in request.path:
        id_field = 'car_id'
    elif 'house' in request.path:
        id_field = 'house_id'

    if not id_field:
        return None, Response({"error": "Invalid rating endpoint"}, status=status.HTTP_400_BAD_REQUEST)

    entity_id = data.get(id_field)
    score = data.get('score')

    if not entity_id or score is None:
        return None, Response({"error": f"{id_field} and score are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        score = float(score)
        # Allow only 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
        if score < 0 or score > 5 or (score * 2) % 1 != 0:
            return None, Response({"error": "Score must be between 0 and 5 in 0.5 increments"}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return None, Response({"error": "Score must be a valid number"}, status=status.HTTP_400_BAD_REQUEST)

    return (entity_id, score), None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_car(request):
    car_id = request.data.get('car_id')
    score = float(request.data.get('score', 0))
    
    try:
        car = Car.objects.get(id=car_id)
        car_rating, _ = CarRating.objects.get_or_create(car_id=car)
        
        # Get or update user's rating
        user_rating, created = UserCarRating.objects.get_or_create(
            user=request.user,
            car=car,
            defaults={'score': score}
        )
        
        if not created:
            user_rating.score = score
            user_rating.save()
            
        car_rating.recalculate_rating()
        return Response({
            'average': car_rating.average,
            'rating_count': car_rating.rating_count,
            'your_rating': score
        })
    except Car.DoesNotExist:
        return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_car_rating(request, car_id):
    """
    Returns aggregated car rating.
    Public endpoint - no authentication required
    """
    try:
        obj = CarRating.objects.get(car_id=car_id)
    except CarRating.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(CarRatingSerializer(obj).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_house(request):
    house_id = request.data.get('house_id')
    score = float(request.data.get('score', 0))
    
    try:
        house = House.objects.get(id=house_id)
        house_rating, _ = HouseRating.objects.get_or_create(house_id=house)
        
        # Get or update user's rating
        user_rating, created = UserHouseRating.objects.get_or_create(
            user=request.user,
            house=house,
            defaults={'score': score}
        )
        
        if not created:
            user_rating.score = score
            user_rating.save()
            
        house_rating.recalculate_rating()
        return Response({
            'average': house_rating.average,
            'rating_count': house_rating.rating_count,
            'your_rating': score
        })
    except House.DoesNotExist:
        return Response({'error': 'House not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_house_rating(request, house_id):
    """
    Returns aggregated house rating.
    Public endpoint - no authentication required
    """
    try:
        obj = HouseRating.objects.get(house_id=house_id)
    except HouseRating.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(HouseRatingSerializer(obj).data)

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from .models import CarRating, HouseRating
from .serializers import CarRatingSerializer, HouseRatingSerializer

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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def rate_car(request):
    """
    Body: { "car_id": "xyz", "score": 4.5 }
    Accepts both JSON and form data
    Requires JWT authentication
    """
    result, error = validate_rating_request(request)
    if error:
        return error
    
    car_id, score = result
    obj, _ = CarRating.objects.get_or_create(car_id=car_id)
    obj.add_rating(score)
    return Response(CarRatingSerializer(obj).data, status=status.HTTP_200_OK)

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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def rate_house(request):
    """
    Body: { "house_id": "abc", "score": 5 }
    Accepts both JSON and form data
    Requires JWT authentication
    """
    result, error = validate_rating_request(request)
    if error:
        return error
    
    house_id, score = result
    obj, _ = HouseRating.objects.get_or_create(house_id=house_id)
    obj.add_rating(score)
    return Response(HouseRatingSerializer(obj).data, status=status.HTTP_200_OK)

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

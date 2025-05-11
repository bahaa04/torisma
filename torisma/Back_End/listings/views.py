from rest_framework import generics, permissions, filters, status, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from coupons.models import Coupon
from .models import Car, House, Favorite, CarPhotos, HousePhotos, Wilaya, WilayaPhotos, WilayaPhoto
from .serializers import (
    CarSerializer, HouseSerializer, FavoriteSerializer, CarPhotosSerializer,
    HousePhotosSerializer, WilayaSerializer, WilayaPhotosSerializer, WilayaPhotoSerializer
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .filters import HouseFilter

class CarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'price': ['exact', 'gte', 'lte'],
        'wilaya': ['exact'],
        'status': ['exact'],
        'manufacturing_year': ['exact', 'gte', 'lte'],
        'seats': ['exact', 'gte', 'lte'],
        'fuel_type': ['exact']
    }
    search_fields = ['description', 'manufacture', 'model', 'location']
    ordering_fields = ['price', 'created_at', 'manufacturing_year']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Car.objects.all()
        
        # Handle price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        # Handle year range
        min_year = self.request.query_params.get('min_year')
        max_year = self.request.query_params.get('max_year')
        if min_year:
            queryset = queryset.filter(manufacturing_year__gte=min_year)
        if max_year:
            queryset = queryset.filter(manufacturing_year__lte=max_year)
            
        # Handle seats range
        min_seats = self.request.query_params.get('min_seats')
        max_seats = self.request.query_params.get('max_seats')
        if min_seats:
            queryset = queryset.filter(seats__gte=min_seats)
        if max_seats:
            queryset = queryset.filter(seats__lte=max_seats)
            
        # Handle wilaya filter
        wilaya = self.request.query_params.get('wilaya')
        if wilaya:
            queryset = queryset.filter(wilaya__name=wilaya)
            
        return queryset

class HouseListView(ListAPIView):
    """
    View to list all houses with filtering options.
    """
    serializer_class = HouseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = HouseFilter
    ordering_fields = ['price']  # Allow ordering by price
    ordering = ['price']  # Default ordering by ascending price

    def get_queryset(self):
        queryset = House.objects.all()
        wilaya = self.request.query_params.get('wilaya')
        if wilaya:
            queryset = queryset.filter(wilaya__name=wilaya)
        return queryset

# 🔍 List & Create Listings
class CarListCreateView(generics.ListCreateAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['wilaya', 'price', 'status']
    search_fields = ['description', 'manufacture', 'model']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Car.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        wilaya_name = serializer.validated_data.get('wilaya')

        # Ensure the wilaya exists in the table
        wilaya_obj, created = Wilaya.objects.get_or_create(name=wilaya_name)

        # Save the car with the associated wilaya
        car = serializer.save(owner=user, wilaya=wilaya_obj)

        # Handle multiple photos
        photos = self.request.FILES.getlist('photos')
        for photo in photos:
            CarPhotos.objects.create(car=car, photo=photo)

        # Update user role if necessary
        if user.role == 'customer':
            user.role = 'renter'
            user.save()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class HouseListCreateView(generics.ListCreateAPIView):
    serializer_class = HouseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['wilaya', 'price', 'type', 'status']
    search_fields = ['description', 'exact_location']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return House.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        wilaya_name = serializer.validated_data.get('wilaya')

        # Save the house with the wilaya name directly
        house = serializer.save(owner=user)

        # Handle multiple photos
        photos = self.request.FILES.getlist('photos')
        for photo in photos:
            HousePhotos.objects.create(house=house, photo=photo)

        # Update user role if necessary
        if user.role == 'customer':
            user.role = 'renter'
            user.save()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

# 🔄 Retrieve, Update, Delete a single listing
class CarRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return Car.objects.filter(owner=self.request.user)
        return Car.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        coupon_code = request.query_params.get("coupon")
        discount = 0

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, active=True)
                now = timezone.now()
                if coupon.valid_from <= now <= coupon.valid_until:
                    discount = coupon.discount_percentage
                else:
                    return Response({"error": "Coupon expired"}, status=status.HTTP_400_BAD_REQUEST)
            except Coupon.DoesNotExist:
                return Response({"error": "Invalid coupon code"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance)
        data = serializer.data
        if discount > 0:
            data["discounted_price"] = f"{float(data['price']) * (1 - discount / 100):.2f}"
        return Response(data)

class HouseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HouseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return House.objects.filter(owner=self.request.user)
        return House.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        coupon_code = request.query_params.get("coupon")
        discount = 0

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, active=True)
                now = timezone.now()
                if coupon.valid_from <= now <= coupon.valid_until:
                    discount = coupon.discount_percentage
                else:
                    return Response({"error": "Coupon expired"}, status=status.HTTP_400_BAD_REQUEST)
            except Coupon.DoesNotExist:
                return Response({"error": "Invalid coupon code"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance)
        data = serializer.data
        if discount > 0:
            data["discounted_price"] = f"{float(data['price']) * (1 - discount / 100):.2f}"
        return Response(data)

# ❤️ Favorite a listing
class AddFavoriteView(generics.CreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_id = self.kwargs.get("item_id")
        item_type = request.data.get("item_type", "car")  # Default to car if not specified

        # Get the correct model and content type
        model = Car if item_type == "car" else House
        content_type = ContentType.objects.get_for_model(model)
        
        # Try to get the item
        item = get_object_or_404(model, id=item_id)

        # Try to create the favorite
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            object_id=item.id
        )

        if not created:
            return Response({"detail": "Item already favorited."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Item favorited successfully."}, status=status.HTTP_201_CREATED)

# 💔 Remove a favorite listing
class RemoveFavoriteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        item_id = self.kwargs.get("item_id")
        item_type = request.data.get("item_type", "car")  # Default to car if not specified

        # Get the correct model and content type
        model = Car if item_type == "car" else House
        content_type = ContentType.objects.get_for_model(model)
        
        # Try to get the favorite
        favorite = Favorite.objects.filter(
            user=request.user,
            content_type=content_type,
            object_id=item_id
        ).first()

        if not favorite:
            return Response({"detail": "Item is not in favorites."}, status=status.HTTP_400_BAD_REQUEST)

        favorite.delete()
        return Response({"detail": "Item removed from favorites."}, status=status.HTTP_204_NO_CONTENT)

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class HouseViewSet(viewsets.ModelViewSet):
    queryset = House.objects.all()
    serializer_class = HouseSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class WilayaListView(APIView):
    def get(self, request):
        # Return all wilayas, not just those with cars or houses
        wilayas = Wilaya.objects.all()
        serializer = WilayaSerializer(wilayas, many=True, context={'request': request})
        return Response(serializer.data)

class WilayaPhotosViewSet(ModelViewSet):
    queryset = WilayaPhotos.objects.all()
    serializer_class = WilayaPhotosSerializer

class HouseByWilayaListView(ListAPIView):
    serializer_class = HouseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = HouseFilter
    search_fields = ['description', 'exact_location']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']
    pagination_class = None  # Disable pagination to match frontend expectations

    def get_queryset(self):
        wilaya_name = self.kwargs.get('wilaya_name')
        return House.objects.filter(wilaya__iexact=wilaya_name).prefetch_related('photos')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'results': serializer.data})

class CarByWilayaListView(ListAPIView):
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'manufacture', 'model', 'location']
    ordering_fields = ['price', 'created_at', 'manufacturing_year']
    ordering = ['-created_at']
    pagination_class = None

    def get_queryset(self):
        wilaya_name = self.kwargs.get('wilaya_name')
        return Car.objects.filter(wilaya__iexact=wilaya_name).prefetch_related('photos')

class CarsByWilayaView(APIView):
    def get(self, request, wilaya):
        cars = Car.objects.filter(wilaya=wilaya)
        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data)

class WilayaViewSet(viewsets.ModelViewSet):
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer

class CarPhotoViewSet(viewsets.ModelViewSet):
    queryset = CarPhotos.objects.all()
    serializer_class = CarPhotosSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CarPhotos.objects.filter(car__owner=self.request.user)

    def perform_create(self, serializer):
        car_id = self.request.data.get('car')
        car = get_object_or_404(Car, id=car_id, owner=self.request.user)
        serializer.save(car=car)

class HousePhotoViewSet(viewsets.ModelViewSet):
    queryset = HousePhotos.objects.all()
    serializer_class = HousePhotosSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HousePhotos.objects.filter(house__owner=self.request.user)

    def perform_create(self, serializer):
        house_id = self.request.data.get('house')
        house = get_object_or_404(House, id=house_id, owner=self.request.user)
        serializer.save(house=house)

class WilayaPhotoViewSet(viewsets.ModelViewSet):
    queryset = WilayaPhoto.objects.all()
    serializer_class = WilayaPhotoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HousesByWilayaView(APIView):
    def get(self, request, wilaya_name):
        try:
            print(f"Received wilaya_name: {wilaya_name}")
            wilaya_name = wilaya_name.capitalize()
            
            # Special case for Alger
            if wilaya_name.lower() in ['alger', 'alger']:
                wilaya_name = 'Alger'
            
            houses = House.objects.filter(wilaya__iexact=wilaya_name).prefetch_related('photos')
            serializer = HouseSerializer(houses, many=True, context={'request': request})
            return Response({
                'results': serializer.data,
                'count': houses.count()
            })
        except Exception as e:
            print(f"Error in HousesByWilayaView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HouseListByWilayaView(APIView):
    def get(self, request, wilaya):
        try:
            houses = House.objects.filter(wilaya__iexact=wilaya)
            serializer = HouseSerializer(houses, many=True)
            return Response({
                'results': serializer.data,
                'count': houses.count()
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_coupon_for_listing(request, listing_type, listing_id):
    """Validate and calculate discounted price for a car or house listing"""
    try:
        coupon_code = request.data.get('coupon_code')
        if not coupon_code:
            return Response({"error": "Coupon code is required"}, status=400)

        # Get the listing
        if listing_type == 'car':
            listing = Car.objects.get(id=listing_id)
        elif listing_type == 'house':
            listing = House.objects.get(id=listing_id)
        else:
            return Response({"error": "Invalid listing type"}, status=400)

        # Validate coupon
        try:
            coupon = Coupon.objects.get(code=coupon_code, active=True)
            now = timezone.now()
            if coupon.valid_from <= now <= coupon.valid_to:
                # Calculate discount
                original_price = listing.price
                discount = original_price * (coupon.discount_percentage / 100)
                discounted_price = original_price - discount

                return Response({
                    "valid": True,
                    "original_price": original_price,
                    "discount_percentage": coupon.discount_percentage,
                    "discount_amount": discount,
                    "final_price": discounted_price,
                    "coupon_code": coupon_code
                })
            else:
                return Response({"valid": False, "error": "Coupon has expired"}, status=400)
        except Coupon.DoesNotExist:
            return Response({"valid": False, "error": "Invalid coupon code"}, status=400)

    except (Car.DoesNotExist, House.DoesNotExist):
        return Response({"error": "Listing not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

class UserCarListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        cars = Car.objects.filter(owner=request.user)
        serializer = CarSerializer(cars, many=True, context={'request': request})
        return Response(serializer.data)

class UserHouseListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        houses = House.objects.filter(owner=request.user)
        serializer = HouseSerializer(houses, many=True, context={'request': request})
        return Response(serializer.data)



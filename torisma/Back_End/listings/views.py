from rest_framework import generics, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from .models import Car, HouseHotel, Favorite
from .serializers import CarSerializer, HouseHotelSerializer, FavoriteSerializer

class CarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'price', 'la_wilaya', 'currency']
    search_fields = ['description', 'manufacture', 'model']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Car.objects.filter(is_active=True)

class HouseHotelListView(generics.ListAPIView):
    serializer_class = HouseHotelSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'price', 'la_wilaya', 'currency', 'type']
    search_fields = ['description', 'exact_location']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return HouseHotel.objects.filter(is_active=True)

# 🔍 List & Create Listings
class CarListCreateView(generics.ListCreateAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['la_wilaya', 'price', 'currency']
    search_fields = ['description', 'manufacture', 'model']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Car.objects.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class HouseHotelListCreateView(generics.ListCreateAPIView):
    serializer_class = HouseHotelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['la_wilaya', 'price', 'currency', 'type']
    search_fields = ['description', 'exact_location']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return HouseHotel.objects.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

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
        return Car.objects.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class HouseHotelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HouseHotelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return HouseHotel.objects.filter(owner=self.request.user)
        return HouseHotel.objects.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

# ❤️ Favorite a listing
class AddFavoriteView(generics.CreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_id = self.kwargs.get("item_id")
        item_type = request.data.get("item_type", "car")  # Default to car if not specified

        # Get the correct model and content type
        model = Car if item_type == "car" else HouseHotel
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
        model = Car if item_type == "car" else HouseHotel
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



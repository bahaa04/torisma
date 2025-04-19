from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CarListView,
    CarListCreateView,
    CarRetrieveUpdateDestroyView,
    HouseListView,
    HouseListCreateView,
    HouseRetrieveUpdateDestroyView,
    AddFavoriteView,
    RemoveFavoriteView,
    WilayaListView,
    WilayaPhotosViewSet,
)

# Create a router for wilaya photos
wilaya_router = DefaultRouter()
wilaya_router.register(r'photos', WilayaPhotosViewSet, basename='wilaya-photos')

urlpatterns = [
    # Car endpoints
    path('cars/', CarListView.as_view(), name='car-list'),
    path('cars/create/', CarListCreateView.as_view(), name='car-create'),
    path('cars/<uuid:pk>/', CarRetrieveUpdateDestroyView.as_view(), name='car-detail'),
    
    # House endpoints
    path('houses/', HouseListView.as_view(), name='house-list'),
    path('houses/create/', HouseListCreateView.as_view(), name='house-create'),
    path('houses/<uuid:pk>/', HouseRetrieveUpdateDestroyView.as_view(), name='house-detail'),
    
    # Favorite endpoints
    path('favorites/', AddFavoriteView.as_view(), name='favorites-list'),
    path('<uuid:item_id>/favorite/', AddFavoriteView.as_view(), name='add-favorite'),
    path('<uuid:item_id>/unfavorite/', RemoveFavoriteView.as_view(), name='remove-favorite'),

    # Wilaya endpoints
    path('wilayas/', WilayaListView.as_view(), name='wilaya-list'),
    path('wilayas/', include(wilaya_router.urls)),  # Include wilaya photos under wilayas/
]

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
    HouseByWilayaListView,
    CarByWilayaListView,
    WilayaPhotoViewSet,  # <-- add this import
    HousesByWilayaView,  # <-- add this import
    HouseListByWilayaView,  # <-- add this import
    CarsByWilayaView,  # <-- add this import
    validate_coupon_for_listing,  # <-- add this import
    UserCarListView,
    UserHouseListView,
    apply_coupon,  # Add this import
    RateHouseView,  # Add this import for rating
    GetHouseRatingView,  # Add this import to get house rating
    RateCarView,  # Add this import for car rating
    GetCarRatingView,  # Add this import to get car rating
)

wilaya_router = DefaultRouter()
wilaya_router.register(r'photos', WilayaPhotosViewSet, basename='wilaya-photos')

urlpatterns = [
    # Car endpoints
    path('cars/', CarListView.as_view(), name='car-list'),
    path('cars/create/', CarListCreateView.as_view(), name='car-create'),
    path('cars/<uuid:pk>/', CarRetrieveUpdateDestroyView.as_view(), name='car-detail'),
    path('cars/by_wilaya/<str:wilaya_name>/', CarByWilayaListView.as_view(), name='wilaya-car-list'),
    
    # House endpoints
    path('houses/', HouseListView.as_view(), name='house-list'),
    path('houses/create/', HouseListCreateView.as_view(), name='house-create'),
    path('houses/<uuid:pk>/', HouseRetrieveUpdateDestroyView.as_view(), name='house-detail'),
    path('houses/by_wilaya/<str:wilaya_name>/', HouseByWilayaListView.as_view(), name='wilaya-house-list'),
    
    # Favorite endpoints
    path('favorites/', AddFavoriteView.as_view(), name='favorites-list'),
    path('<uuid:item_id>/favorite/', AddFavoriteView.as_view(), name='add-favorite'),
    path('<uuid:item_id>/unfavorite/', RemoveFavoriteView.as_view(), name='remove-favorite'),

    # Wilaya endpoints
    path('wilayas/', WilayaListView.as_view(), name='wilaya-list'),
    path('wilayas/photos/', WilayaPhotosViewSet.as_view({'get': 'list', 'post': 'create'}), name='wilaya-photos-list'),
    path('wilayas/photos/<int:pk>/', WilayaPhotosViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='wilaya-photos-detail'),

    # Coupon validation endpoints
    path('apply-coupon/', apply_coupon, name='apply-coupon'),  # Add this new path

    path('cars/user/', UserCarListView.as_view(), name='user-car-list'),
    path('houses/user/', UserHouseListView.as_view(), name='user-house-list'),

    # Rating endpoints
    path('rate/house/', RateHouseView.as_view(), name='rate-house'),
    path('rate/car/', RateCarView.as_view(), name='rate-car'),
    path('house/<uuid:house_id>/rating/', GetHouseRatingView.as_view(), name='get-house-rating'),
    path('car/<uuid:car_id>/rating/', GetCarRatingView.as_view(), name='get-car-rating'),
]

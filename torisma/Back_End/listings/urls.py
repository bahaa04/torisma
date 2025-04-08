from django.urls import path
from .views import (
    CarListView,
    CarListCreateView,
    CarRetrieveUpdateDestroyView,
    HouseHotelListView,
    HouseHotelListCreateView,
    HouseHotelRetrieveUpdateDestroyView,
    AddFavoriteView,
    RemoveFavoriteView,
)

urlpatterns = [
    # Car endpoints
    path('cars/', CarListView.as_view(), name='car-list'),
    path('cars/create/', CarListCreateView.as_view(), name='car-create'),
    path('cars/<uuid:pk>/', CarRetrieveUpdateDestroyView.as_view(), name='car-detail'),
    
    # House/Hotel endpoints
    path('houses-hotels/', HouseHotelListView.as_view(), name='house-hotel-list'),
    path('houses-hotels/create/', HouseHotelListCreateView.as_view(), name='house-hotel-create'),
    path('houses-hotels/<uuid:pk>/', HouseHotelRetrieveUpdateDestroyView.as_view(), name='house-hotel-detail'),
    
    # Favorite endpoints
    path('<uuid:item_id>/favorite/', AddFavoriteView.as_view(), name='add-favorite'),
    path('<uuid:item_id>/unfavorite/', RemoveFavoriteView.as_view(), name='remove-favorite'),
]

from django.urls import path
from . import views

urlpatterns = [
    path('api/rate/car/', views.rate_car, name='rate-car'),
    path('api/car/<str:car_id>/rating/', views.get_car_rating, name='get-car-rating'),
    path('api/rate/house/', views.rate_house, name='rate-house'),
    path('api/house/<str:house_id>/rating/', views.get_house_rating, name='get-house-rating'),
]

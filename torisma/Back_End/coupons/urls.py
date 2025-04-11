from django.urls import path
from . import views

urlpatterns = [
    path('api/check-coupon/<str:code>/', views.check_coupon, name='check-coupon'),
]

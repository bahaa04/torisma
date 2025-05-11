# recommendations/urls.py
from django.urls import path
from .views import get_recommendation, get_csrf_token, handle_authentication_error

urlpatterns = [
    path('api/recommend/', get_recommendation, name='get_recommendation'),
    path('api/csrf-token/', get_csrf_token, name='get_csrf_token'),
]

handler401 = handle_authentication_error
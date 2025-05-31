from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'coupons', views.CouponViewSet, basename='coupon')

urlpatterns = [
    path('', views.CouponListCreateView.as_view(), name='coupon-list-create'),
    path('<int:pk>/', views.CouponDetailView.as_view(), name='coupon-detail'),
    path('validate/', views.validate_coupon, name='validate_coupon'),
]

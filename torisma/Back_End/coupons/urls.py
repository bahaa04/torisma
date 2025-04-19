from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'coupons', views.CouponViewSet, basename='coupon')

urlpatterns = [
    path('', views.CouponListCreateView.as_view(), name='coupon-list-create'),
    path('<int:pk>/', views.CouponDetailView.as_view(), name='coupon-detail'),
    path('check/<str:code>/', views.check_coupon, name='check_coupon'),
    path('notify/<int:coupon_id>/', views.send_coupon_notification, name='send_coupon_notification'),
    path('api/', include(router.urls)),  # Add the router URLs
]

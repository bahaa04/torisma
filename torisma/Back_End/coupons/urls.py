from django.urls import path
from . import views

urlpatterns = [
    path('', views.CouponListCreateView.as_view(), name='coupon-list-create'),
    path('<int:pk>/', views.CouponDetailView.as_view(), name='coupon-detail'),
    path('check/<str:code>/', views.check_coupon, name='check_coupon'),
    path('notify/<int:coupon_id>/', views.send_coupon_notification, name='send_coupon_notification'),
]

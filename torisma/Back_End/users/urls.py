from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserRegisterView, CustomTokenObtainPairView, AdminUserManagementView, UserProfileView, VerifyEmailView, LogoutView, ForgotPasswordView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/users/<int:user_id>/', AdminUserManagementView.as_view(), name='admin_user_management'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
]

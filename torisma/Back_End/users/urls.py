from django.urls import path
from .views import (
    UserRegisterView,
    CustomTokenObtainPairView,
    AdminUserManagementView,
    UserProfileView,
    VerifyEmailView,
    LogoutView,
    ForgotPasswordView,
    PasswordResetConfirmView,
    PasswordResetFormView,
    CustomLoginView,
    CustomTokenRefreshView,
)

# Authentication URLs
auth_patterns = [
    path('auth/register/', UserRegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
]

# Password management URLs
password_patterns = [
    path('password/forgot/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('password/reset/<str:uidb64>/<str:token>/', PasswordResetFormView.as_view(), name='password_reset_form'),
    path('password/reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

# User profile URLs
profile_patterns = [
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UserProfileView.as_view(), name='update_profile'),
]

# Admin management URLs
admin_patterns = [
    path('admin/users/', AdminUserManagementView.as_view(), name='admin_users_list'),
    path('admin/users/<int:user_id>/', AdminUserManagementView.as_view(), name='admin_user_management'),
]

# Combine all URL patterns
urlpatterns = auth_patterns + password_patterns + profile_patterns + admin_patterns

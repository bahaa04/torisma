from rest_framework import generics, permissions, status
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator, PasswordResetTokenGenerator
from django.urls import reverse, path
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)  # Add a logger for debugging

User = get_user_model()

class UserRegisterView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            # Check for duplicate email
            if User.objects.filter(email=serializer.validated_data['email']).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user as inactive
        user = User.objects.create_user(
            email=serializer.validated_data['email'],
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            phone_number=serializer.validated_data.get('phone_number', ''),
            gender=serializer.validated_data.get('gender', None),
            is_active=False  # Set user as inactive until email is verified
        )

        # Send verification email
        try:
            send_verification_email(user, request)
            return Response({"message": "Verification email sent. Please check your inbox."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Failed to send verification email: {e}")
            user.delete()  # Rollback user creation if email fails
            return Response({"error": "Failed to send verification email. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def send_verification_email(user, request):
    try:
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))  # Use the user's primary key for UID encoding
        verification_link = request.build_absolute_uri(
            reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
        )
        subject = 'Verify your email address'
        message = f'Hi {user.username},\n\nPlease click the link below to verify your email address:\n{verification_link}\n\nThank you!'
        
        # Log the email details for debugging
        logger.info(f"Attempting to send verification email to {user.email}")
        logger.info(f"Verification link: {verification_link}")
        
        # Send the email
        send_mail(subject, message, 'noreply@example.com', [user.email])
        logger.info("Verification email sent successfully.")
    except Exception as e:
        logger.error(f"Failed to send verification email: {e}")
        raise e


class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            # Decode the user ID from uidb64
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            # Validate the token
            if not default_token_generator.check_token(user, token):
                logger.error("Invalid token.")
                return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

            # Activate the user upon successful verification
            user.is_active = True
            user.is_email_verified = True
            user.save()

            logger.info(f"User {user.email} verified successfully.")
            return Response({'message': 'Email verified successfully. You can now log in.'}, status=status.HTTP_200_OK)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            logger.error(f"Error during email verification: {e}")
            return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(email=request.data.get("email"))
            if user.is_banned:
                return Response({"error": "User is banned"}, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            pass  # Handle missing user gracefully

        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(email=request.data.get("email"))
            response.data["role"] = user.role
        except User.DoesNotExist:
            response.data["role"] = None  # Handle missing user gracefully
        return response

class AdminUserManagementView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        role = request.data.get("role")
        is_banned = request.data.get("is_banned")

        if role:
            user.role = role
        if is_banned is not None:
            user.is_active = not is_banned  # Deactivate user if banned
            user.is_banned = is_banned  # Update the is_banned field
        user.save()

        return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"Authenticated user: {request.user}")  # Debug statement
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token to log out the user
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Logout failed: {e}")
            return Response({"error": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = request.build_absolute_uri(
                reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            )

            subject = 'Password Reset Request'
            message = render_to_string('emails/password_reset_email.html', {
                'user': user,
                'reset_link': reset_link,
            })

            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            logger.info(f"Password reset email sent to {user.email}")
            return Response({"message": "Password reset email sent. Please check your inbox."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            logger.error(f"Password reset requested for non-existent email: {email}")
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Failed to send password reset email: {e}")
            return Response({"error": "Failed to send password reset email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

urlpatterns = [
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
]

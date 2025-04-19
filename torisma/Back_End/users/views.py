from rest_framework import generics, permissions, status
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated  # Fix syntax error
from django.core.mail import EmailMessage, send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator, PasswordResetTokenGenerator
from django.urls import reverse, path
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from django.conf import settings
import logging
from django.shortcuts import render
from django.views import View
import requests

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
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = request.build_absolute_uri(
            reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
        )
        
        # Use template rendering for better email formatting
        context = {
            'user': user,
            'verification_link': verification_link
        }
        # Update the template path to match the actual file location
        email_body = render_to_string('emails/Verification_email.html', context)
        
        email = EmailMessage(
            subject='Verify your email address',
            body=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,  # Use DEFAULT_FROM_EMAIL instead of EMAIL_FROM_ADDRESS
            to=[user.email]
        )
        email.content_subtype = "html"  # Set email content type to HTML
        email.send()
        
        logger.info(f"Verification email sent to {user.email}")
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
            logger.info(f"Login attempt for user: {user.email}")
            if user.is_banned:
                logger.warning(f"Banned user attempted to login: {user.email}")
                return Response({"error": "User is banned"}, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            logger.warning(f"Login attempt with non-existent email: {request.data.get('email')}")
            pass

        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(email=request.data.get("email"))
            response.data["role"] = user.role
            logger.info(f"Successful login for user: {user.email}")
        except User.DoesNotExist:
            response.data["role"] = None
            logger.error("Could not find user after successful authentication")
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
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            # Check if password is being changed
            is_password_change = 'new_password' in request.data
            
            # Save the changes
            serializer.save()
            
            # If password was changed, blacklist the current refresh token
            if is_password_change:
                try:
                    refresh_token = request.data.get('refresh_token')
                    if refresh_token:
                        token = RefreshToken(refresh_token)
                        token.blacklist()
                        return Response(
                            {"message": "Profile updated and password changed successfully. Please login again with your new password."},
                            status=status.HTTP_200_OK
                        )
                except Exception as e:
                    logger.error(f"Error blacklisting token: {e}")
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if not auth_header.startswith('Bearer '):
                return Response(
                    {"error": "Authentication token is required"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            try:
                # Create a RefreshToken instance and blacklist it
                token = RefreshToken(refresh_token)
                token.blacklist()
                logger.info(f"User {request.user.email} logged out successfully")
                return Response(
                    {"message": "Logged out successfully"}, 
                    status=status.HTTP_200_OK
                )
                
            except Exception as token_error:
                logger.error(f"Token validation failed: {str(token_error)}")
                if "Token is invalid or expired" in str(token_error):
                    return Response(
                        {"error": "Invalid or expired refresh token"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                return Response(
                    {"error": "Invalid token format"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Logout failed: {str(e)}")
            return Response(
                {"error": "Logout failed. Please try again."}, 
                status=status.HTTP_400_BAD_REQUEST
            )


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
            
            # Use the correct URL name for the reset link
            reset_link = request.build_absolute_uri(
                reverse('password_reset_form', kwargs={'uidb64': uid, 'token': token})
            )

            subject = 'Password Reset Request'
            message = render_to_string('emails/password_reset_email.html', {
                'user': user,
                'reset_link': reset_link,
            })

            # Use EmailMessage for better control
            email = EmailMessage(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email.content_subtype = "html"  # Set content type to HTML
            
            # Try to send the email
            try:
                email.send(fail_silently=False)
                logger.info(f"Password reset email sent successfully to {user.email}")
                return Response({"message": "Password reset email sent. Please check your inbox."}, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Failed to send password reset email: {str(e)}")
                return Response({"error": "Failed to send password reset email. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except User.DoesNotExist:
            logger.error(f"Password reset requested for non-existent email: {email}")
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in password reset: {str(e)}")
            return Response({"error": "An unexpected error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        """Verify the reset token and return a form for password reset"""
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            if not default_token_generator.check_token(user, token):
                return Response(
                    {"error": "Invalid or expired password reset link"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Token is valid, return success
            return Response({
                "message": "Token is valid",
                "email": user.email  # Return email for confirmation
            }, status=status.HTTP_200_OK)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid password reset link"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, uidb64, token):
        """Process the password reset"""
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            if not default_token_generator.check_token(user, token):
                return Response(
                    {"error": "Invalid or expired password reset link"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            new_password = request.data.get("new_password")
            if not new_password:
                return Response(
                    {"error": "New password is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password
            user.set_password(new_password)
            user.save()

            # Send confirmation email
            try:
                subject = 'Password Reset Successful'
                message = render_to_string('emails/password_reset_success.html', {
                    'user': user,
                })
                send_mail(
                    subject,
                    message,
                    settings.EMAIL_FROM_ADDRESS,
                    [user.email]
                )
                logger.info(f"Password reset confirmation sent to {user.email}")
            except Exception as e:
                logger.error(f"Failed to send password reset confirmation: {e}")

            return Response(
                {"message": "Password has been reset successfully. You can now login with your new password."},
                status=status.HTTP_200_OK
            )

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid password reset link"},
                status=status.HTTP_400_BAD_REQUEST
            )

class PasswordResetFormView(View):
    template_name = 'users/password_reset_form.html'

    def get(self, request, uidb64, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            if not default_token_generator.check_token(user, token):
                return render(request, self.template_name, {
                    'error': 'Invalid or expired password reset link'
                })

            return render(request, self.template_name, {
                'uidb64': uidb64,
                'token': token
            })

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return render(request, self.template_name, {
                'error': 'Invalid password reset link'
            })

    def post(self, request, uidb64, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            if not default_token_generator.check_token(user, token):
                return render(request, self.template_name, {
                    'error': 'Invalid or expired password reset link'
                })

            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')

            if not new_password or not confirm_password:
                return render(request, self.template_name, {
                    'error': 'Both password fields are required',
                    'uidb64': uidb64,
                    'token': token
                })

            if new_password != confirm_password:
                return render(request, self.template_name, {
                    'error': 'Passwords do not match',
                    'uidb64': uidb64,
                    'token': token
                })

            # Make a POST request to the API endpoint
            api_url = request.build_absolute_uri(
                reverse('password_reset_confirm', kwargs={'uidb64': uidb64, 'token': token})
            )
            
            response = requests.post(api_url, json={'new_password': new_password})
            
            if response.status_code == 200:
                return render(request, self.template_name, {
                    'success': 'Password has been reset successfully. You can now login with your new password.'
                })
            else:
                return render(request, self.template_name, {
                    'error': 'Failed to reset password. Please try again.',
                    'uidb64': uidb64,
                    'token': token
                })

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return render(request, self.template_name, {
                'error': 'Invalid password reset link'
            })
        except Exception as e:
            logger.error(f"Error in password reset form: {str(e)}")
            return render(request, self.template_name, {
                'error': 'An unexpected error occurred. Please try again.',
                'uidb64': uidb64,
                'token': token
            })

urlpatterns = [
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
]


from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import ValidationError
from .models import User

class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
            if user.is_banned:
                return None  # Deny authentication for banned users
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None

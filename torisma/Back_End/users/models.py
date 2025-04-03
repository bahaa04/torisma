from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('customer', 'Customer'),
        ('renter', 'Renter'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, blank=True, null=True)  # Add gender field

    is_banned = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Add phone number field

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",  # Avoid clash with auth.User.groups
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",  # Avoid clash with auth.User.user_permissions
        blank=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        if self.role == 'admin':
            self.is_staff = True
        super().save(*args, **kwargs)

    def has_module_perms(self, app_label):
        if self.role == 'admin':
            return True
        return super().has_module_perms(app_label)

    def has_perm(self, perm, obj=None):
        if self.is_banned:
            return False  # Prevent banned users from having any permissions
        if self.role == 'admin':
            return True
        return super().has_perm(perm, obj)

    def __str__(self):
        return self.email

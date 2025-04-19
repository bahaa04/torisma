from django.contrib import admin
from django.contrib.auth.models import User
from django.core.mail import send_mail

# Unregister the default User admin and register a custom one
admin.site.unregister(User)


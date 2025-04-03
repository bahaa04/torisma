from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Customize the admin interface for the User model if needed
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('profile_image', 'role', 'gender', 'is_banned', 'phone_number')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('profile_image', 'role', 'gender', 'is_banned', 'phone_number')}),
    )
    list_display = ('email', 'username', 'role', 'is_banned')
    list_editable = ('role',)  # Allow editing roles directly in the list view
    list_filter = ('role', 'is_banned')
    search_fields = ('email', 'username')  # Optional: Add search functionality
    ordering = ('email',)  # Optional: Order by email
    actions = ['ban_users', 'unban_users']

    def ban_users(self, request, queryset):
        for user in queryset:
            user.is_banned = True
            user.is_active = False
            user.save()

    def unban_users(self, request, queryset):
        for user in queryset:
            user.is_banned = False
            user.is_active = True
            user.save()

    ban_users.short_description = "Ban selected users"
    unban_users.short_description = "Unban selected users"

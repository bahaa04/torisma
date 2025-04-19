from django.contrib import admin
from django.contrib import messages
from django.conf import settings
from django.contrib.auth import get_user_model  # Use get_user_model to reference the custom user model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Coupon

User = get_user_model()  # Get the custom user model

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percentage', 'valid_from', 'valid_until', 'active')
    search_fields = ('code',)
    list_filter = ('active', 'valid_from', 'valid_until')
    ordering = ('-valid_from',)
    fields = ('code', 'discount_percentage', 'valid_from', 'valid_until', 'active')
    actions = ['activate_coupons', 'deactivate_coupons', 'send_coupon_notification']

    def get_queryset(self, request):
        # Deactivate expired coupons before displaying them
        Coupon.deactivate_expired_coupons()
        return super().get_queryset(request)

    @admin.action(description='Activate selected coupons')
    def activate_coupons(self, request, queryset):
        queryset.update(active=True)

    @admin.action(description='Deactivate selected coupons')
    def deactivate_coupons(self, request, queryset):
        queryset.update(active=False)

    @admin.action(description='Send coupon notification to all users')
    def send_coupon_notification(self, request, queryset):
        """
        Admin action to send notification emails about selected coupons to all users
        """
        coupons_sent = 0
        user_emails = User.objects.filter(is_active=True).exclude(email='').values_list('email', flat=True)  # Use custom user model
        total_users = len(user_emails)
        
        if total_users == 0:
            self.message_user(
                request,
                "No active users with email addresses found.",
                level=messages.WARNING
            )
            return
            
        for coupon in queryset:
            # Skip inactive coupons
            if not coupon.active:
                self.message_user(
                    request, 
                    f"Skipped inactive coupon: {coupon.code}", 
                    level=messages.WARNING
                )
                continue
                
            # Ensure discount_percentage is valid and properly formatted
            discount_percentage = coupon.discount_percentage or 0  # Fallback to 0 if None
            discount_amount = f"{int(discount_percentage)}%"  # Ensure it's an integer and append '%'

            # Prepare context for the email template
            context = {
                'coupon_code': coupon.code,
                'discount_amount': discount_amount,  # Matches template variable
                'expiry_date': coupon.valid_until.strftime('%Y-%m-%d'),  # Matches template variable
                'valid_from': coupon.valid_from.strftime('%Y-%m-%d'),
                'shop_name': request.site.name if hasattr(request, 'site') else 'Our Store'
            }
            
            # Send to all users
            for email in user_emails:
                try:
                    html_message = render_to_string('notifications/coupon_notification.html', context)
                    plain_message = strip_tags(html_message)
                    send_mail(
                        subject=f"New Coupon: {coupon.code}",
                        message=plain_message,
                        html_message=html_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False,
                    )
                except Exception as e:
                    self.message_user(
                        request,
                        f"Failed to send email to {email}: {str(e)}",
                        level=messages.ERROR
                    )
            
            coupons_sent += 1
            
        if coupons_sent > 0:
            self.message_user(
                request,
                f"Notification emails sent for {coupons_sent} coupon(s) to {total_users} users.",
                level=messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                "No notification emails were sent. Please check that selected coupons are active.",
                level=messages.WARNING
            )
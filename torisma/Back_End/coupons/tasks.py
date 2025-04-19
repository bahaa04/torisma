from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_coupon_email_task(email, context):
    try:
        logger.info(f"Preparing to send email to {email} with context: {context}")
        
        # Use the existing coupon notification template
        html_message = render_to_string('notifications/coupon_notification.html', context)
        plain_message = strip_tags(html_message)

        # Send email
        send_mail(
            subject=getattr(settings, 'COUPON_NOTIFICATION_SUBJECT', 'New Coupon Available!'),
            message=plain_message,
            html_message=html_message,
            from_email=getattr(settings, 'COUPON_NOTIFICATION_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL),
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"Email successfully sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending email to {email}: {str(e)}")
        return False

@shared_task
def notify_all_users_about_coupon(coupon_code, discount_amount, expiry_date, description=None, additional_context=None):
    """
    Parent task that sends coupon notification emails to all registered users.
    Uses the existing coupon_notification.html template.
    
    Args:
        coupon_code (str): The code for the coupon
        discount_amount (str): The discount amount (e.g., "20%" or "$10")
        expiry_date (str): When the coupon expires
        description (str, optional): Additional details about the coupon
        additional_context (dict, optional): Any additional context to pass to the template
    """
    User = get_user_model()
    
    # Get all active users with emails
    users = User.objects.filter(is_active=True).exclude(email='').values_list('email', flat=True)
    
    # Prepare context for the email template
    context = {
        'coupon_code': coupon_code,
        'discount_amount': discount_amount,
        'expiry_date': expiry_date,
        'description': description
    }
    
    # Add any additional context provided
    if additional_context:
        context.update(additional_context)
    
    total_users = len(users)
    logger.info(f"Starting coupon notification for {total_users} users - Coupon: {coupon_code}")
    
    # Send emails to each user
    for email in users:
        # Call the individual email task
        send_coupon_email_task.delay(email, context)
    
    logger.info(f"Queued coupon notification emails for {total_users} users")
    return {
        'total_users': total_users,
        'coupon_code': coupon_code
    }
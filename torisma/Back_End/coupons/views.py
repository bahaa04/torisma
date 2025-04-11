from django.http import JsonResponse
from django.utils import timezone
from .models import Coupon

def check_coupon(request, code):
    try:
        coupon = Coupon.objects.get(code=code, active=True)
        now = timezone.now()
        if coupon.valid_from <= now <= coupon.valid_until:
            return JsonResponse({"valid": True, "discount": coupon.discount_percentage})
        else:
            return JsonResponse({"valid": False, "error": "Coupon expired"})
    except Coupon.DoesNotExist:
        return JsonResponse({"valid": False, "error": "Invalid coupon code"})



# Create your views here.

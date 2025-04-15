# coupons/views.py

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Coupon
from .serializers import CouponSerializer
from datetime import datetime
from django.utils import timezone

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def list(self, request, *args, **kwargs):
        """
        Custom list view to return only valid coupons (active and within valid time).
        """
        current_time = timezone.now()
        valid_coupons = Coupon.objects.filter(is_active=True, valid_from__lte=current_time, valid_until__gte=current_time)
        serializer = self.get_serializer(valid_coupons, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Custom create view (Optional, can use default create behavior).
        """
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def validate(self, request, pk=None):
        """
        Custom action to validate if a specific coupon is still valid.
        """
        coupon = self.get_object()
        if coupon.is_valid():
            return Response({'status': 'valid'})
        return Response({'status': 'expired'})

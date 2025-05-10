import django_filters
from .models import House

class HouseFilter(django_filters.FilterSet):
    wilaya = django_filters.CharFilter(field_name='wilaya', lookup_expr='iexact')
    city = django_filters.CharFilter(field_name='city', lookup_expr='icontains')
    price = django_filters.NumberFilter(field_name='price')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    has_wifi = django_filters.BooleanFilter(field_name='has_wifi')
    has_parking = django_filters.BooleanFilter(field_name='has_parking')

    class Meta:
        model = House
        fields = [
            'wilaya',
            'city',
            'price',
            'price_min',
            'price_max',
            'has_wifi',
            'has_parking',
        ]

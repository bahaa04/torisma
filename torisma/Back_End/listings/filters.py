import django_filters
from .models import House

class HouseFilter(django_filters.FilterSet):
    la_wilaya = django_filters.CharFilter(field_name='la_wilaya', lookup_expr='iexact')
    price = django_filters.NumberFilter(field_name='price')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    number_of_rooms = django_filters.NumberFilter(field_name='number_of_rooms')
    rooms_min = django_filters.NumberFilter(field_name='number_of_rooms', lookup_expr='gte')
    rooms_max = django_filters.NumberFilter(field_name='number_of_rooms', lookup_expr='lte')
    has_wifi = django_filters.BooleanFilter(field_name='has_wifi')
    has_parking = django_filters.BooleanFilter(field_name='has_parking')

    class Meta:
        model = House
        fields = [
            'la_wilaya',
            'price',
            'price_min',
            'price_max',
            'number_of_rooms',
            'rooms_min',
            'rooms_max',
            'has_wifi',
            'has_parking',
        ]

from django.contrib import admin
from .models import Car, HouseHotel, Favorite

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('manufacture', 'model', 'manufacturing_year', 'seats', 'fuel_type', 'price', 'currency', 'la_wilaya', 'is_active')
    search_fields = ('manufacture', 'model', 'la_wilaya')
    list_filter = ('fuel_type', 'manufacturing_year', 'la_wilaya', 'currency', 'is_active')
    fields = ('owner', 'description', 'price', 'currency', 'location', 'la_wilaya',
              'manufacture', 'model', 'manufacturing_year', 'seats', 'fuel_type', 'is_active')
    actions = ['activate_items', 'deactivate_items']

    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if obj is None:  # Creating a new instance
            fields = [field for field in fields if field != 'is_active']
        return fields

    @admin.action(description='Activate selected cars')
    def activate_items(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected cars')
    def deactivate_items(self, request, queryset):
        queryset.update(is_active=False)

@admin.register(HouseHotel)
class HouseHotelAdmin(admin.ModelAdmin):
    list_display = ('type', 'number_of_rooms', 'has_parking', 'has_wifi', 'is_furnished', 'price', 'currency', 'la_wilaya', 'is_active')
    search_fields = ('exact_location', 'la_wilaya')
    list_filter = ('type', 'has_parking', 'has_wifi', 'is_furnished', 'la_wilaya', 'currency', 'is_active')
    fields = ('owner', 'description', 'price', 'currency', 'location', 'la_wilaya',
              'type', 'number_of_rooms', 'has_parking', 'has_wifi', 'is_furnished', 'exact_location', 'is_active')
    actions = ['activate_items', 'deactivate_items']

    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if obj is None:  # Creating a new instance
            fields = [field for field in fields if field != 'is_active']
        return fields

    @admin.action(description='Activate selected houses/hotels')
    def activate_items(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected houses/hotels')
    def deactivate_items(self, request, queryset):
        queryset.update(is_active=False)

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'created_at')
    search_fields = ('user__username', 'item__description')
    list_filter = ('created_at',)
    fields = ('user', 'item')

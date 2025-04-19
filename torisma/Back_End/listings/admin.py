from .models import Car, House, Favorite, CarPhotos, HousePhotos, Wilaya, wilayas, WilayaPhotos
from django.contrib import admin
from django import forms
from django.contrib.auth.models import User


class CarAdminForm(forms.ModelForm):
    la_wilaya = forms.ChoiceField(choices=[(name, name) for name, _ in wilayas])  # Use predefined Wilayas

    class Meta:
        model = Car
        fields = '__all__'

    def clean_la_wilaya(self):
        wilaya_name = self.cleaned_data['la_wilaya']
        wilaya, created = Wilaya.objects.get_or_create(name=wilaya_name)  # Ensure Wilaya exists in the table
        return wilaya


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    form = CarAdminForm
    list_display = ('manufacture', 'model', 'price', 'status', 'la_wilaya', 'location')
    search_fields = ('manufacture', 'model', 'la_wilaya__name')
    list_filter = ('fuel_type', 'manufacturing_year', 'la_wilaya')
    fields = ('owner', 'description', 'price', 'la_wilaya', 'location',
              'manufacture', 'model', 'manufacturing_year', 'seats', 'fuel_type')
    actions = ['activate_items', 'deactivate_items']

    @admin.action(description='Activate selected cars')
    def activate_items(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected cars')
    def deactivate_items(self, request, queryset):
        queryset.update(is_active=False)



class HouseAdminForm(forms.ModelForm):
    la_wilaya = forms.ChoiceField(choices=[(name, name) for name, _ in wilayas])  # Use predefined Wilayas

    class Meta:
        model = House
        fields = '__all__'

    def clean_la_wilaya(self):
        wilaya_name = self.cleaned_data['la_wilaya']
        wilaya, created = Wilaya.objects.get_or_create(name=wilaya_name)  # Ensure Wilaya exists in the table
        return wilaya


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    form = HouseAdminForm
    list_display = ('number_of_rooms', 'price', 'status', 'la_wilaya', 'exact_location')
    search_fields = ('la_wilaya__name', 'exact_location')
    list_filter = ('has_parking', 'has_wifi', 'la_wilaya')
    fields = ('owner', 'description', 'price', 'la_wilaya', 'exact_location',
              'number_of_rooms', 'has_parking', 'has_wifi')
    actions = ['activate_items', 'deactivate_items']

    @admin.action(description='Activate selected houses')
    def activate_items(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate selected houses')
    def deactivate_items(self, request, queryset):
        queryset.update(is_active=False)


@admin.register(CarPhotos)
class CarPhotosAdmin(admin.ModelAdmin):
    list_display = ('car', 'photo')


@admin.register(HousePhotos)
class HousePhotosAdmin(admin.ModelAdmin):
    list_display = ('house', 'photo')


@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'photo')  # Display photo in the admin list view
    search_fields = ('name',)
    fields = ('name', 'photo')  # Allow editing the photo in the admin form


@admin.register(WilayaPhotos)
class WilayaPhotosAdmin(admin.ModelAdmin):
    list_display = ['wilaya_name', 'photo', 'uploaded_at']
    search_fields = ['wilaya_name']
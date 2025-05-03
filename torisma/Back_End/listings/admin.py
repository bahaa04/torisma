from .models import Car, House, Favorite, CarPhotos, HousePhotos, Wilaya, wilayas, WilayaPhotos, WilayaPhoto
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


class CarPhotosInline(admin.TabularInline):
    model = CarPhotos
    extra = 1
    fields = ['photo']
    can_delete = True  # Enable delete functionality
    show_change_link = True  # Show link to edit individual photos


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    form = CarAdminForm
    list_display = ('manufacture', 'model', 'price', 'status', 'la_wilaya', 'location')
    search_fields = ('manufacture', 'model', 'la_wilaya__name')
    list_filter = ('fuel_type', 'manufacturing_year', 'la_wilaya')
    fields = ('owner', 'description', 'price', 'la_wilaya', 'location',
            'manufacture', 'model', 'manufacturing_year', 'seats', 'fuel_type', 'status')
    inlines = [CarPhotosInline]
    actions = ['activate_items', 'deactivate_items']

    @admin.action(description='Activate selected cars')
    def activate_items(self, request, queryset):
        queryset.update(status='available')

    @admin.action(description='Deactivate selected cars')
    def deactivate_items(self, request, queryset):
        queryset.update(status='disabled')


class HouseAdminForm(forms.ModelForm):
    la_wilaya = forms.ChoiceField(choices=[(name, name) for name, _ in wilayas])  # Use predefined Wilayas

    class Meta:
        model = House
        fields = '__all__'

    def clean_la_wilaya(self):
        wilaya_name = self.cleaned_data['la_wilaya']
        wilaya, created = Wilaya.objects.get_or_create(name=wilaya_name)  # Ensure Wilaya exists in the table
        return wilaya


class HousePhotosInline(admin.TabularInline):
    model = HousePhotos
    extra = 1
    fields = ['photo']
    can_delete = True  # Enable delete functionality
    show_change_link = True  # Show link to edit individual photos


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    form = HouseAdminForm
    list_display = ('number_of_rooms', 'price', 'status', 'la_wilaya', 'exact_location')
    search_fields = ('exact_location', 'la_wilaya__name')
    list_filter = ('number_of_rooms', 'has_parking', 'has_wifi', 'la_wilaya')
    fields = ('owner', 'description', 'price', 'la_wilaya', 'exact_location',
            'number_of_rooms', 'has_parking', 'has_wifi', 'status')
    inlines = [HousePhotosInline]
    actions = ['activate_items', 'deactivate_items']

    @admin.action(description='Activate selected houses')
    def activate_items(self, request, queryset):
        queryset.update(status='available')

    @admin.action(description='Deactivate selected houses')
    def deactivate_items(self, request, queryset):
        queryset.update(status='disabled')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'content_type', 'object_id', 'created_at')
    list_filter = ('content_type', 'created_at')
    search_fields = ('user__username',)


@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(WilayaPhotos)
class WilayaPhotosAdmin(admin.ModelAdmin):
    list_display = ('wilaya_name', 'uploaded_at')
    list_filter = ('wilaya_name', 'uploaded_at')
    search_fields = ('wilaya_name',)


@admin.register(WilayaPhoto)
class WilayaPhotoAdmin(admin.ModelAdmin):
    list_display = ('wilaya', 'uploaded_at')
    list_filter = ('wilaya', 'uploaded_at')
    search_fields = ('wilaya__name',)


@admin.register(CarPhotos)
class CarPhotosAdmin(admin.ModelAdmin):
    list_display = ('car', 'photo')
    list_filter = ('car',)
    search_fields = ('car__manufacture', 'car__model')
    raw_id_fields = ('car',)


@admin.register(HousePhotos)
class HousePhotosAdmin(admin.ModelAdmin):
    list_display = ('house', 'photo')
    list_filter = ('house',)
    search_fields = ('house__exact_location',)
    raw_id_fields = ('house',)
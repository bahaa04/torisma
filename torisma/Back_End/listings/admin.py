from .models import Car, House, Favorite, CarPhotos, HousePhotos, Wilaya, wilayas, WilayaPhotos, WilayaPhoto
from django.contrib import admin
from django import forms
from django.contrib.auth.models import User


class CarAdminForm(forms.ModelForm):
    wilaya = forms.ChoiceField(choices=[(name, name) for name, _ in wilayas])  # Use predefined Wilayas

    class Meta:
        model = Car
        fields = '__all__'

    def clean_wilaya(self):
        wilaya_name = self.cleaned_data['wilaya']
        wilaya, created = Wilaya.objects.get_or_create(name=wilaya_name)  # Ensure Wilaya exists in the table
        return wilaya


class CarPhotosInline(admin.TabularInline):
    model = CarPhotos
    extra = 1
    fields = ['photo']
    can_delete = True  # Enable delete functionality
    show_change_link = True


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    form = CarAdminForm
    list_display = ['manufacture', 'model', 'price', 'wilaya', 'status']  # Changed from la_wilaya to wilaya
    list_filter = ['status', 'wilaya', 'fuel_type']  # Changed from la_wilaya to wilaya
    search_fields = ['manufacture', 'model', 'description']
    inlines = [CarPhotosInline]
    actions = ['activate_items', 'deactivate_items']

    @admin.action(description='Activate selected cars')
    def activate_items(self, request, queryset):
        queryset.update(status='available')

    @admin.action(description='Deactivate selected cars')
    def deactivate_items(self, request, queryset):
        queryset.update(status='disabled')


class HouseAdminForm(forms.ModelForm):
    wilaya = forms.ChoiceField(choices=wilayas)
    city = forms.CharField(required=True)
    gps_location = forms.URLField(required=True, help_text="Google Maps link to the property location")
    price = forms.DecimalField(required=True)
    description = forms.CharField(widget=forms.Textarea, required=False)
    has_parking = forms.BooleanField(required=False)
    has_wifi = forms.BooleanField(required=False)
    rooms = forms.IntegerField(min_value=1, required=True)

    class Meta:
        model = House
        fields = ['description', 'price', 'status', 'has_parking', 
                 'has_wifi', 'wilaya', 'city', 'gps_location', 'rooms']


class HousePhotosInline(admin.TabularInline):
    model = HousePhotos
    extra = 1
    fields = ['photo']
    can_delete = True  # Enable delete functionality
    show_change_link = True


@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    form = HouseAdminForm
    list_display = ['wilaya', 'city', 'price', 'status', 'rooms', 'has_wifi', 'has_parking']
    list_filter = ['status', 'wilaya', 'has_wifi', 'has_parking']
    search_fields = ['city', 'description']
    fieldsets = (
        ('Location', {
            'fields': ('wilaya', 'city', 'gps_location')
        }),
        ('Details', {
            'fields': ('description', 'price', 'status', 'rooms')
        }),
        ('Amenities', {
            'fields': ('has_parking', 'has_wifi')
        }),
    )
    inlines = [HousePhotosInline]

    def save_model(self, request, obj, form, change):
        if not change:  # Only set owner when creating new house
            obj.owner = request.user
        super().save_model(request, obj, form, change)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'content_type', 'object_id', 'created_at')
    list_filter = ('content_type', 'created_at')
    search_fields = ('user__username',)


class WilayaPhotoInline(admin.TabularInline):
    model = WilayaPhoto
    extra = 1
    fields = ['image']
    can_delete = True
    show_change_link = True


@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    inlines = [WilayaPhotoInline]


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
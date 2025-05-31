from django.contrib import admin
from .models import CarReservation, HouseReservation, MastercardPayment, StripePayment

@admin.register(CarReservation)
class CarReservationAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'status', 'start_date')  # Changed created_at to start_date
    list_filter = ('status',)
    search_fields = ('user__username', 'car__manufacture', 'car__model')
    readonly_fields = ('payment_status', 'total_price')  # Removed created_at

@admin.register(HouseReservation)
class HouseReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'house', 'status', 'payment_method', 'payment_status']
    readonly_fields = ['total_price', 'payment_status']
    search_fields = ['user__username', 'house__title']
    list_filter = ['status', 'payment_method', 'payment_status']

@admin.register(MastercardPayment)
class MastercardPaymentAdmin(admin.ModelAdmin):
    list_display = ('cardholder_name', 'card_number', 'created_at', 'is_verified')
    search_fields = ('cardholder_name',)
    readonly_fields = ('created_at',)

@admin.register(StripePayment)
class StripePaymentAdmin(admin.ModelAdmin):
    list_display = ('stripe_payment_intent_id', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('status', 'currency')
    search_fields = ('stripe_payment_intent_id',)
    readonly_fields = ('created_at', 'updated_at')

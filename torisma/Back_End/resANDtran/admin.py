from django.contrib import admin
from .models import CarTransaction, HouseTransaction, CarReservation, HouseReservation

@admin.register(CarTransaction)
class CarTransactionAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'car', 'status', 'confirmation_status', 'payment_status', 'payment_method', 'created_at')
    list_filter = ('status', 'confirmation_status', 'payment_status', 'payment_method')
    search_fields = ('buyer__username', 'car__manufacture', 'car__model')

@admin.register(HouseTransaction)
class HouseTransactionAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'house', 'status', 'confirmation_status', 'payment_status', 'payment_method', 'created_at')
    list_filter = ('status', 'confirmation_status', 'payment_status', 'payment_method')
    search_fields = ('buyer__username', 'house__title')

@admin.register(CarReservation)
class CarReservationAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'start_date', 'end_date', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'car__manufacture', 'car__model')

@admin.register(HouseReservation)
class HouseReservationAdmin(admin.ModelAdmin):
    list_display = ('user', 'house')
    search_fields = ('user__username', 'house__title')

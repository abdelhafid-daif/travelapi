from django.contrib import admin
from .models import CustomUser,Profile

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'adresse', 'city', 'phone_number')
    search_fields = ('email', 'phone_number', 'city')
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar', 'bio', 'is_client','is_commercial','is_support','is_manager','is_comptable')
    search_fields = ('user', 'is_client','is_commercial','is_support','is_manager','is_comptable')

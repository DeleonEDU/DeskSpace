from django.contrib import admin
from .models import Location, Floor, Amenity, Space

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'address')
    search_fields = ('name', 'city')

@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'location')
    list_filter = ('location',)

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_name')

@admin.register(Space)
class SpaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'space_type', 'floor', 'capacity', 'price_per_hour', 'is_active')
    list_filter = ('space_type', 'is_active', 'floor__location')
    search_fields = ('name',)
    filter_horizontal = ('amenities',)

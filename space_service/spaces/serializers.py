from rest_framework import serializers
from .models import Location, Floor, Amenity, Space

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon_name']

class SpaceSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    space_type_display = serializers.CharField(source='get_space_type_display', read_only=True)

    class Meta:
        model = Space
        fields = [
            'id', 'name', 'description', 'space_type', 'space_type_display', 'capacity', 
            'price_per_hour', 'svg_element_id', 'amenities', 'is_active', 'floor'
        ]

class FloorSerializer(serializers.ModelSerializer):
    # Додаємо список просторів одразу при запиті поверху, щоб фронт міг відрендерити мапу
    spaces = SpaceSerializer(many=True, read_only=True)

    class Meta:
        model = Floor
        fields = ['id', 'location', 'level', 'name', 'map_image', 'spaces']

class LocationSerializer(serializers.ModelSerializer):
    floors = FloorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'city', 'country', 'floors']

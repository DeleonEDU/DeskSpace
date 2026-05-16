from rest_framework import serializers

from spaces.models import Amenity, Floor, Location, Space


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name", "icon_name"]


class SpaceListSerializer(serializers.ModelSerializer):
    space_type_display = serializers.CharField(
        source="get_space_type_display", read_only=True
    )
    floor_level = serializers.IntegerField(source="floor.level", read_only=True)

    class Meta:
        model = Space
        fields = [
            "id",
            "name",
            "description",
            "space_type",
            "space_type_display",
            "capacity",
            "price_per_hour",
            "svg_element_id",
            "is_active",
            "floor",
            "floor_level",
        ]


class SpaceSerializer(SpaceListSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta(SpaceListSerializer.Meta):
        fields = SpaceListSerializer.Meta.fields + ["amenities"]


class FloorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = ["id", "location", "level", "name", "map_image"]


class FloorSerializer(FloorListSerializer):
    spaces = SpaceListSerializer(many=True, read_only=True)

    class Meta(FloorListSerializer.Meta):
        fields = FloorListSerializer.Meta.fields + ["spaces"]


class LocationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "name", "address", "city", "country"]


class LocationSerializer(LocationListSerializer):
    floors = FloorSerializer(many=True, read_only=True)

    class Meta(LocationListSerializer.Meta):
        fields = LocationListSerializer.Meta.fields + ["floors"]

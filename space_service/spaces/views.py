from django_filters import rest_framework as django_filters
from rest_framework import filters, permissions, viewsets

from spaces.models import Amenity, Floor, Location, Space
from spaces.permissions import IsStaffOrReadOnly
from spaces.serializers import (
    AmenitySerializer,
    FloorListSerializer,
    FloorSerializer,
    LocationListSerializer,
    LocationSerializer,
    SpaceListSerializer,
    SpaceSerializer,
)
from spaces.services.space_query_service import SpaceQueryService

SERIALIZER_ACTION_MAP = {
    Location: {
        "list": LocationListSerializer,
        "retrieve": LocationSerializer,
        "default": LocationSerializer,
    },
    Floor: {
        "list": FloorListSerializer,
        "retrieve": FloorSerializer,
        "default": FloorSerializer,
    },
    Amenity: {
        "default": AmenitySerializer,
    },
    Space: {
        "list": SpaceListSerializer,
        "retrieve": SpaceSerializer,
        "default": SpaceSerializer,
    },
}


class SpaceFilter(django_filters.FilterSet):
    id__in = django_filters.BaseInFilter(field_name="id", lookup_expr="in")
    svg_id__in = django_filters.BaseInFilter(field_name="svg_element_id", lookup_expr="in")

    class Meta:
        model = Space
        fields = ["floor", "floor__location", "space_type", "capacity", "is_active"]


class BaseSpaceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    query_service = SpaceQueryService()

    def get_serializer_class(self):
        resource_map = SERIALIZER_ACTION_MAP.get(self.queryset.model, {})
        return resource_map.get(
            self.action,
            resource_map.get("default", SpaceSerializer),
        )

    def get_queryset(self):
        resource_key = self.resource_name
        is_staff = getattr(self.request.user, "is_staff", False)
        return self.query_service.queryset_for(resource_key, is_staff=is_staff)


class LocationViewSet(BaseSpaceViewSet):
    queryset = Location.objects.all()
    resource_name = "location"


class FloorViewSet(BaseSpaceViewSet):
    queryset = Floor.objects.all()
    resource_name = "floor"
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_fields = ["location", "level"]


class AmenityViewSet(BaseSpaceViewSet):
    queryset = Amenity.objects.all()
    resource_name = "amenity"


class SpaceViewSet(BaseSpaceViewSet):
    queryset = Space.objects.all()
    resource_name = "space"
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = SpaceFilter
    search_fields = ["name", "description"]

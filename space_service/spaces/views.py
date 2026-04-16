from rest_framework import viewsets, permissions, filters
from django_filters import rest_framework as django_filters
from .models import Location, Floor, Amenity, Space
from .serializers import LocationSerializer, FloorSerializer, AmenitySerializer, SpaceSerializer

class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'is_staff') and request.user.is_staff

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by('name')
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

class FloorViewSet(viewsets.ModelViewSet):
    queryset = Floor.objects.all().order_by('location', 'level')
    serializer_class = FloorSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_fields = ['location', 'level']

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all().order_by('name')
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

# Кастомний фільтр для розширених запитів
class SpaceFilter(django_filters.FilterSet):
    # Дозволяє шукати через кому: ?id__in=1,2,3
    id__in = django_filters.BaseInFilter(field_name='id', lookup_expr='in')
    # Дозволяє шукати через кому по SVG ID: ?svg_id__in=desk-1,desk-2
    svg_id__in = django_filters.BaseInFilter(field_name='svg_element_id', lookup_expr='in')

    class Meta:
        model = Space
        fields = ['floor', 'floor__location', 'space_type', 'capacity', 'is_active']

class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.filter(is_active=True).order_by('name')
    serializer_class = SpaceSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = SpaceFilter
    search_fields = ['name', 'description']

    def get_queryset(self):
        qs = super().get_queryset()
        if hasattr(self.request.user, 'is_staff') and self.request.user.is_staff:
            return Space.objects.all().order_by('name')
        return qs

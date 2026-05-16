from spaces.models import Amenity, Floor, Location, Space


class SpaceRepository:
    def locations_queryset(self):
        return Location.objects.all().order_by("name").prefetch_related(
            "floors__spaces__amenities"
        )

    def floors_queryset(self):
        return Floor.objects.select_related("location").prefetch_related(
            "spaces__amenities"
        ).order_by("location", "level")

    def amenities_queryset(self):
        return Amenity.objects.all().order_by("name")

    def spaces_queryset(self, *, include_inactive: bool):
        qs = Space.objects.select_related("floor", "floor__location").prefetch_related(
            "amenities"
        )
        if not include_inactive:
            qs = qs.filter(is_active=True)
        return qs.order_by("name")

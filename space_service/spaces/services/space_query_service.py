from spaces.repositories.space_repository import SpaceRepository


class SpaceQueryService:
    def __init__(self, repository: SpaceRepository | None = None):
        self.repository = repository or SpaceRepository()

    def queryset_for(self, resource: str, *, is_staff: bool):
        scope_handlers = {
            "location": lambda: self.repository.locations_queryset(),
            "floor": lambda: self.repository.floors_queryset(),
            "amenity": lambda: self.repository.amenities_queryset(),
            "space": lambda: self.repository.spaces_queryset(include_inactive=is_staff),
        }
        return scope_handlers[resource]()

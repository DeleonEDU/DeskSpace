from dataclasses import dataclass


@dataclass(frozen=True)
class SpaceSnapshot:
    """ACL DTO — minimal space data from space_service (no shared DB)."""

    id: int
    is_active: bool
    name: str = ""
    floor: int | None = None

    @classmethod
    def from_api(cls, payload: dict) -> "SpaceSnapshot":
        return cls(
            id=payload["id"],
            is_active=payload.get("is_active", True),
            name=payload.get("name", ""),
            floor=payload.get("floor_level"),
        )

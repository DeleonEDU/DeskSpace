from django.utils import timezone

from bookings.clients.space_client import SpaceClient
from bookings.domain.dtos import SpaceSnapshot
from bookings.domain.exceptions import (
    AvailabilityParamsError,
    BookingCancellationError,
    BookingConflictError,
    SpaceInactiveError,
    SpaceNotFoundError,
)
from bookings.repositories.booking_repository import BookingRepository


SPACE_VALIDATORS = {
    "exists": (lambda snapshot: snapshot is not None, "Space does not exist."),
    "active": (lambda snapshot: snapshot.is_active, "Space is not available for booking."),
}

CANCEL_RULES = {
    "past_or_ongoing": (
        lambda booking, now: booking.start_time <= now,
        "Cannot delete past or ongoing bookings.",
    ),
}

AVAILABILITY_REQUIRED_PARAMS = ("space_id", "start_time", "end_time")


class BookingService:
    """Domain service — booking rules and cross-service space validation."""

    def __init__(
        self,
        repository: BookingRepository | None = None,
        space_client: SpaceClient | None = None,
    ):
        self.repository = repository or BookingRepository()
        self.space_client = space_client

    def create_booking(
        self,
        *,
        user_id: int,
        space_id: int,
        start_time,
        end_time,
        auth_header: str | None,
    ):
        snapshot = self._fetch_and_validate_space(space_id, auth_header)

        booking = self.repository.create_confirmed_atomic(
            user_id, space_id, start_time, end_time
        )
        if booking is None:
            raise BookingConflictError(
                "This space is already booked for the selected time."
            )

        return booking, snapshot

    def cancel_booking(self, booking):
        now = timezone.now()
        blocked_messages = [
            message
            for _, (check, message) in CANCEL_RULES.items()
            if check(booking, now)
        ]
        if blocked_messages:
            raise BookingCancellationError(blocked_messages[0])

        return self.repository.cancel(booking)

    def check_availability(
        self, *, space_id: int, start_time, end_time, auth_header: str | None
    ) -> bool:
        self._fetch_and_validate_space(space_id, auth_header)
        return not self.repository.has_overlap(space_id, start_time, end_time)

    def validate_availability_params(self, params: dict) -> dict:
        from django.utils.dateparse import parse_datetime

        missing = [key for key in AVAILABILITY_REQUIRED_PARAMS if not params.get(key)]
        if missing:
            raise AvailabilityParamsError(
                "space_id, start_time, and end_time are required."
            )

        parsed = {key: params[key] for key in AVAILABILITY_REQUIRED_PARAMS}
        parsed["space_id"] = int(parsed["space_id"])
        for time_key in ("start_time", "end_time"):
            dt = parse_datetime(parsed[time_key])
            if not dt:
                raise AvailabilityParamsError(
                    f"Invalid datetime format for {time_key}."
                )
            parsed[time_key] = dt
        return parsed

    def _fetch_and_validate_space(
        self, space_id: int, auth_header: str | None
    ) -> SpaceSnapshot:
        if not self.space_client:
            raise SpaceNotFoundError("Space client is not configured.")

        snapshot = self.space_client.fetch_space(space_id, auth_header)
        self._validate_space_snapshot(snapshot)
        return snapshot

    def _validate_space_snapshot(self, snapshot: SpaceSnapshot | None) -> None:
        for _, (predicate, message) in SPACE_VALIDATORS.items():
            if not predicate(snapshot):
                error_type = SpaceNotFoundError if snapshot is None else SpaceInactiveError
                raise error_type(message)

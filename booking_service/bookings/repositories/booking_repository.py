from contextlib import contextmanager

from django.db import connection, transaction

from bookings.domain.constants import BookingStatus
from bookings.models import Booking
from bookings.specifications.overlap import OverlapSpecification


@contextmanager
def _lock_space_booking(space_id: int):
    """Serialize bookings per space (PostgreSQL advisory lock; SQLite best-effort)."""
    if connection.vendor == "postgresql":
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_advisory_xact_lock(%s)", [space_id])
        yield
        return

    Booking.objects.filter(space_id=space_id).select_for_update()
    yield


class BookingRepository:
    def get_by_id(self, booking_id: int) -> Booking | None:
        return Booking.objects.filter(pk=booking_id).first()

    def has_overlap(self, space_id: int, start_time, end_time) -> bool:
        return OverlapSpecification(space_id, start_time, end_time).is_satisfied()

    def create_confirmed(
        self, user_id: int, space_id: int, start_time, end_time
    ) -> Booking:
        return Booking.objects.create(
            user_id=user_id,
            space_id=space_id,
            start_time=start_time,
            end_time=end_time,
            status=BookingStatus.CONFIRMED,
        )

    def create_confirmed_atomic(
        self, user_id: int, space_id: int, start_time, end_time
    ) -> Booking | None:
        """Create booking if no overlap; returns None when slot is taken (race-safe)."""
        with transaction.atomic():
            with _lock_space_booking(space_id):
                if OverlapSpecification(space_id, start_time, end_time).is_satisfied():
                    return None
                return self.create_confirmed(
                    user_id, space_id, start_time, end_time
                )

    def cancel(self, booking: Booking) -> Booking:
        booking.status = BookingStatus.CANCELLED
        booking.save(update_fields=["status", "updated_at"])
        return booking

    def list_for_scope(
        self,
        *,
        user_id: int,
        is_staff: bool,
        start_time_gte: str | None = None,
        end_time_lte: str | None = None,
    ):
        qs = Booking.objects.all().order_by("-created_at")
        date_range_filter = start_time_gte and end_time_lte
        scope_handlers = {
            "date_range": lambda: qs.filter(
                status=BookingStatus.CONFIRMED,
                start_time__lt=end_time_lte,
                end_time__gt=start_time_gte,
            ),
            "staff": lambda: qs,
            "owner": lambda: qs.filter(user_id=user_id),
        }
        scope_key = "date_range" if date_range_filter else ("staff" if is_staff else "owner")
        return scope_handlers[scope_key]()

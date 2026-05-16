from django.db.models import Q

from bookings.domain.constants import BookingStatus
from bookings.models import Booking


class OverlapSpecification:
    """Specification: confirmed bookings overlapping a time window."""

    def __init__(self, space_id: int, start_time, end_time):
        self.space_id = space_id
        self.start_time = start_time
        self.end_time = end_time

    def to_queryset(self):
        return Booking.objects.filter(
            space_id=self.space_id,
            status=BookingStatus.CONFIRMED,
        ).filter(
            Q(start_time__lt=self.end_time) & Q(end_time__gt=self.start_time)
        )

    def is_satisfied(self) -> bool:
        return self.to_queryset().exists()

class BookingStatus:
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


ACTIVE_BOOKING_STATUSES = frozenset({BookingStatus.CONFIRMED})

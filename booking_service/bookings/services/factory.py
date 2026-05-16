from bookings.clients.space_client import HttpSpaceClient
from bookings.services.booking_service import BookingService


def get_booking_service() -> BookingService:
    return BookingService(space_client=HttpSpaceClient())

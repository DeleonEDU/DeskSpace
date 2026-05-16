from rest_framework import status

from bookings.domain.exceptions import (
    AvailabilityParamsError,
    BookingCancellationError,
    BookingConflictError,
    BookingDomainError,
    SpaceInactiveError,
    SpaceNotFoundError,
    SpaceServiceUnavailableError,
)

ERROR_RESPONSE_MAP: dict[type[BookingDomainError], tuple[int, str]] = {
    SpaceNotFoundError: (status.HTTP_404_NOT_FOUND, "Space does not exist."),
    SpaceInactiveError: (status.HTTP_400_BAD_REQUEST, "Space is not available for booking."),
    SpaceServiceUnavailableError: (
        status.HTTP_503_SERVICE_UNAVAILABLE,
        "Space service is temporarily unavailable.",
    ),
    BookingConflictError: (
        status.HTTP_400_BAD_REQUEST,
        "This space is already booked for the selected time.",
    ),
    BookingCancellationError: (
        status.HTTP_400_BAD_REQUEST,
        "Cannot delete past or ongoing bookings.",
    ),
    AvailabilityParamsError: (
        status.HTTP_400_BAD_REQUEST,
        "space_id, start_time, and end_time are required.",
    ),
}


def response_for_domain_error(error: BookingDomainError) -> tuple[int, str]:
    status_code, default_message = ERROR_RESPONSE_MAP.get(
        type(error),
        (status.HTTP_400_BAD_REQUEST, str(error)),
    )
    message = str(error) or default_message
    return status_code, message

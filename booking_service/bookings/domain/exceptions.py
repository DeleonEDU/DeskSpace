class BookingDomainError(Exception):
    """Base class for booking domain errors."""


class SpaceNotFoundError(BookingDomainError):
    pass


class SpaceInactiveError(BookingDomainError):
    pass


class SpaceServiceUnavailableError(BookingDomainError):
    pass


class BookingConflictError(BookingDomainError):
    pass


class BookingCancellationError(BookingDomainError):
    pass


class AvailabilityParamsError(BookingDomainError):
    pass

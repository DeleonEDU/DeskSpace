from datetime import timedelta
from unittest.mock import MagicMock

from django.test import TestCase
from django.utils import timezone

from bookings.domain.dtos import SpaceSnapshot
from bookings.domain.exceptions import (
    BookingConflictError,
    BookingCancellationError,
    SpaceInactiveError,
    SpaceNotFoundError,
)
from bookings.models import Booking
from bookings.repositories.booking_repository import BookingRepository
from bookings.services.booking_service import BookingService


class BookingServiceTests(TestCase):
    def setUp(self):
        self.space_client = MagicMock()
        self.service = BookingService(
            repository=BookingRepository(),
            space_client=self.space_client,
        )
        self.now = timezone.now()
        self.start = self.now + timedelta(days=1)
        self.end = self.start + timedelta(hours=2)
        self.active_space = SpaceSnapshot(id=1, is_active=True, name="Desk 1")

    def test_create_rejects_missing_space(self):
        self.space_client.fetch_space.return_value = None
        with self.assertRaises(SpaceNotFoundError):
            self.service.create_booking(
                user_id=1,
                space_id=99,
                start_time=self.start,
                end_time=self.end,
                auth_header="Bearer token",
            )

    def test_create_rejects_inactive_space(self):
        self.space_client.fetch_space.return_value = SpaceSnapshot(
            id=1, is_active=False, name="Closed"
        )
        with self.assertRaises(SpaceInactiveError):
            self.service.create_booking(
                user_id=1,
                space_id=1,
                start_time=self.start,
                end_time=self.end,
                auth_header="Bearer token",
            )

    def test_create_rejects_overlap(self):
        self.space_client.fetch_space.return_value = self.active_space
        Booking.objects.create(
            user_id=2,
            space_id=1,
            start_time=self.start,
            end_time=self.end,
            status="confirmed",
        )
        with self.assertRaises(BookingConflictError):
            self.service.create_booking(
                user_id=1,
                space_id=1,
                start_time=self.start + timedelta(minutes=30),
                end_time=self.end + timedelta(minutes=30),
                auth_header="Bearer token",
            )

    def test_create_confirmed_atomic_rejects_overlap(self):
        self.space_client.fetch_space.return_value = self.active_space
        Booking.objects.create(
            user_id=2,
            space_id=1,
            start_time=self.start,
            end_time=self.end,
            status="confirmed",
        )
        booking = self.service.repository.create_confirmed_atomic(
            user_id=1,
            space_id=1,
            start_time=self.start + timedelta(minutes=30),
            end_time=self.end + timedelta(minutes=30),
        )
        self.assertIsNone(booking)

    def test_cancel_past_booking_blocked(self):
        booking = Booking.objects.create(
            user_id=1,
            space_id=1,
            start_time=self.now - timedelta(days=1),
            end_time=self.now - timedelta(hours=22),
            status="confirmed",
        )
        with self.assertRaises(BookingCancellationError):
            self.service.cancel_booking(booking)

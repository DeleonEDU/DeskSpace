from datetime import timedelta
from unittest.mock import patch

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from bookings.domain.dtos import SpaceSnapshot
from bookings.models import Booking
from bookings.tests.test_helpers import authenticate_jwt


def _mock_space_snapshot(space_id, auth_header=None):
    return SpaceSnapshot(
        id=space_id,
        is_active=True,
        name=f"Space {space_id}",
        floor=4,
    )


@patch(
    "bookings.clients.space_client.HttpSpaceClient.fetch_space",
    side_effect=_mock_space_snapshot,
)
class BookingIntegrationTests(APITestCase):
    def setUp(self):
        authenticate_jwt(self.client, user_id=1, email="user@example.com")
        self.staff_client = self.client.__class__()
        authenticate_jwt(self.staff_client, user_id=99, email="staff@example.com", is_staff=True)

        self.booking_list_url = reverse("booking-list")
        self.check_availability_url = reverse("booking-check-availability")

        self.space_id = 1
        self.now = timezone.now()
        self.start_time = self.now + timedelta(days=1)
        self.end_time = self.start_time + timedelta(hours=2)

        self.booking_data = {
            "space_id": self.space_id,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
        }

    def test_create_booking(self, _mock_fetch):
        response = self.client.post(self.booking_list_url, self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)

        booking = Booking.objects.first()
        self.assertEqual(booking.user_id, 1)
        self.assertEqual(booking.space_id, self.space_id)
        self.assertEqual(booking.status, "confirmed")

    def test_create_booking_space_not_found(self, mock_fetch):
        mock_fetch.return_value = None
        response = self.client.post(self.booking_list_url, self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Booking.objects.count(), 0)

    def test_create_booking_inactive_space(self, mock_fetch):
        mock_fetch.return_value = SpaceSnapshot(id=1, is_active=False, name="Closed")
        response = self.client.post(self.booking_list_url, self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Booking.objects.count(), 0)

    def test_create_booking_missing_fields(self, _mock_fetch):
        invalid_data = {"space_id": self.space_id}
        response = self.client.post(self.booking_list_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("start_time", response.data)
        self.assertIn("end_time", response.data)

    def test_create_overlapping_booking(self, _mock_fetch):
        self.client.post(self.booking_list_url, self.booking_data)

        overlap_data = {
            "space_id": self.space_id,
            "start_time": (self.start_time + timedelta(hours=1)).isoformat(),
            "end_time": (self.end_time + timedelta(hours=1)).isoformat(),
        }
        response = self.client.post(self.booking_list_url, overlap_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Booking.objects.count(), 1)

    def test_create_adjacent_booking(self, _mock_fetch):
        self.client.post(self.booking_list_url, self.booking_data)

        adjacent_data = {
            "space_id": self.space_id,
            "start_time": self.end_time.isoformat(),
            "end_time": (self.end_time + timedelta(hours=2)).isoformat(),
        }
        response = self.client.post(self.booking_list_url, adjacent_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 2)

    def test_check_availability(self, _mock_fetch):
        response = self.client.get(
            self.check_availability_url,
            {
                "space_id": self.space_id,
                "start_time": self.start_time.isoformat(),
                "end_time": self.end_time.isoformat(),
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["available"])

        self.client.post(self.booking_list_url, self.booking_data)

        response = self.client.get(
            self.check_availability_url,
            {
                "space_id": self.space_id,
                "start_time": self.start_time.isoformat(),
                "end_time": self.end_time.isoformat(),
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["available"])

    def test_cancel_booking(self, _mock_fetch):
        response = self.client.post(self.booking_list_url, self.booking_data)
        booking_id = response.data["id"]

        detail_url = reverse("booking-detail", args=[booking_id])
        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        booking = Booking.objects.get(id=booking_id)
        self.assertEqual(booking.status, "cancelled")

    def test_cancel_past_booking(self, _mock_fetch):
        past_start = self.now - timedelta(days=1)
        past_end = past_start + timedelta(hours=2)

        booking = Booking.objects.create(
            user_id=1,
            space_id=self.space_id,
            start_time=past_start,
            end_time=past_end,
            status="confirmed",
        )

        detail_url = reverse("booking-detail", args=[booking.id])
        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        booking.refresh_from_db()
        self.assertEqual(booking.status, "confirmed")

    def test_filter_bookings_by_date_range(self, _mock_fetch):
        self.client.post(self.booking_list_url, self.booking_data)

        filter_start = self.start_time - timedelta(hours=1)
        filter_end = self.end_time + timedelta(hours=1)

        response = self.client.get(
            self.booking_list_url,
            {
                "start_time__gte": filter_start.isoformat(),
                "end_time__lte": filter_end.isoformat(),
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        filter_start_2 = self.end_time + timedelta(hours=1)
        filter_end_2 = self.end_time + timedelta(hours=3)

        response = self.client.get(
            self.booking_list_url,
            {
                "start_time__gte": filter_start_2.isoformat(),
                "end_time__lte": filter_end_2.isoformat(),
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_user_can_only_see_own_bookings(self, _mock_fetch):
        self.client.post(self.booking_list_url, self.booking_data)

        Booking.objects.create(
            user_id=2,
            space_id=2,
            start_time=self.start_time,
            end_time=self.end_time,
            status="confirmed",
        )

        response = self.client.get(self.booking_list_url)
        self.assertEqual(len(response.data), 1)

        response = self.staff_client.get(self.booking_list_url)
        self.assertEqual(len(response.data), 2)

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from bookings.models import Booking

User = get_user_model()

class BookingIntegrationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='user', email='user@example.com', password='password'
        )
        self.staff_user = User.objects.create_user(
            username='staff', email='staff@example.com', password='password', is_staff=True
        )
        self.client.force_authenticate(user=self.user)
        
        self.booking_list_url = reverse('booking-list')
        self.check_availability_url = reverse('booking-check-availability')
        
        self.space_id = 1
        self.now = timezone.now()
        self.start_time = self.now + timedelta(days=1)
        self.end_time = self.start_time + timedelta(hours=2)
        
        self.booking_data = {
            'space_id': self.space_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat()
        }

    def test_create_booking(self):
        """Test creating a new booking successfully"""
        response = self.client.post(self.booking_list_url, self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        
        booking = Booking.objects.first()
        self.assertEqual(booking.user_id, self.user.id)
        self.assertEqual(booking.space_id, self.space_id)
        self.assertEqual(booking.status, 'confirmed')

    def test_create_booking_missing_fields(self):
        """Test creating a booking with missing fields fails"""
        invalid_data = {
            'space_id': self.space_id,
            # missing start_time, end_time
        }
        response = self.client.post(self.booking_list_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start_time', response.data)
        self.assertIn('end_time', response.data)

    def test_create_overlapping_booking(self):
        """Test creating a booking that overlaps with an existing one fails"""
        # Create initial booking
        self.client.post(self.booking_list_url, self.booking_data)
        
        # Attempt to create overlapping booking (starts during the first one)
        overlap_data = {
            'space_id': self.space_id,
            'start_time': (self.start_time + timedelta(hours=1)).isoformat(),
            'end_time': (self.end_time + timedelta(hours=1)).isoformat()
        }
        response = self.client.post(self.booking_list_url, overlap_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Booking.objects.count(), 1) # Still only 1 booking

    def test_create_adjacent_booking(self):
        """Test creating a booking that starts exactly when another ends succeeds"""
        self.client.post(self.booking_list_url, self.booking_data)
        
        # New booking starts exactly at the end_time of the first
        adjacent_data = {
            'space_id': self.space_id,
            'start_time': self.end_time.isoformat(),
            'end_time': (self.end_time + timedelta(hours=2)).isoformat()
        }
        response = self.client.post(self.booking_list_url, adjacent_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 2)

    def test_check_availability(self):
        """Test availability check endpoint"""
        # Initially available
        response = self.client.get(self.check_availability_url, {
            'space_id': self.space_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat()
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['available'])
        
        # Create booking
        self.client.post(self.booking_list_url, self.booking_data)
        
        # Now unavailable
        response = self.client.get(self.check_availability_url, {
            'space_id': self.space_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat()
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['available'])

    def test_cancel_booking(self):
        """Test cancelling an upcoming booking"""
        response = self.client.post(self.booking_list_url, self.booking_data)
        booking_id = response.data['id']
        
        detail_url = reverse('booking-detail', args=[booking_id])
        response = self.client.delete(detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        booking = Booking.objects.get(id=booking_id)
        self.assertEqual(booking.status, 'cancelled')

    def test_cancel_past_booking(self):
        """Test cancelling a past booking fails"""
        past_start = self.now - timedelta(days=1)
        past_end = past_start + timedelta(hours=2)
        
        booking = Booking.objects.create(
            user_id=self.user.id,
            space_id=self.space_id,
            start_time=past_start,
            end_time=past_end,
            status='confirmed'
        )
        
        detail_url = reverse('booking-detail', args=[booking.id])
        response = self.client.delete(detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        booking.refresh_from_db()
        self.assertEqual(booking.status, 'confirmed')

    def test_filter_bookings_by_date_range(self):
        """Test filtering bookings to see occupied spaces"""
        # Create booking
        self.client.post(self.booking_list_url, self.booking_data)
        
        # Filter range that includes the booking
        filter_start = self.start_time - timedelta(hours=1)
        filter_end = self.end_time + timedelta(hours=1)
        
        response = self.client.get(self.booking_list_url, {
            'start_time__gte': filter_start.isoformat(),
            'end_time__lte': filter_end.isoformat()
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Filter range that does NOT include the booking
        filter_start_2 = self.end_time + timedelta(hours=1)
        filter_end_2 = self.end_time + timedelta(hours=3)
        
        response = self.client.get(self.booking_list_url, {
            'start_time__gte': filter_start_2.isoformat(),
            'end_time__lte': filter_end_2.isoformat()
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_user_can_only_see_own_bookings(self):
        """Test normal users see only their bookings, staff see all"""
        # Create booking for user1
        self.client.post(self.booking_list_url, self.booking_data)
        
        # Create booking for user2
        user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password')
        Booking.objects.create(
            user_id=user2.id,
            space_id=2,
            start_time=self.start_time,
            end_time=self.end_time,
            status='confirmed'
        )
        
        # User1 sees 1 booking
        response = self.client.get(self.booking_list_url)
        self.assertEqual(len(response.data), 1)
        
        # Staff sees 2 bookings
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.booking_list_url)
        self.assertEqual(len(response.data), 2)

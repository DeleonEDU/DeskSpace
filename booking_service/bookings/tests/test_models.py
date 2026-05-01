from django.test import TestCase
from bookings.models import Booking
from django.utils import timezone
from datetime import timedelta

class BookingModelTests(TestCase):
    def test_booking_str(self):
        """Test the string representation of the Booking model"""
        now = timezone.now()
        end = now + timedelta(hours=2)
        
        booking = Booking(
            id=10, 
            user_id=5, 
            space_id=3, 
            start_time=now, 
            end_time=end,
            status='confirmed'
        )
        
        self.assertEqual(str(booking), 'Booking 10 for Space 3 by User 5')

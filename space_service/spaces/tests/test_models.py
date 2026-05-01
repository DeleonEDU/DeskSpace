from django.test import TestCase
from spaces.models import Location, Floor, Amenity, Space

class SpaceModelTests(TestCase):
    def test_location_str(self):
        """Test the string representation of Location"""
        loc = Location(name='HQ', city='Kyiv', country='Ukraine')
        self.assertEqual(str(loc), 'HQ (Kyiv, Ukraine)')

    def test_floor_str(self):
        """Test the string representation of Floor"""
        loc = Location(name='HQ', city='Kyiv', country='Ukraine')
        floor = Floor(location=loc, level=3)
        self.assertEqual(str(floor), 'HQ - Floor 3')

    def test_amenity_str(self):
        """Test the string representation of Amenity"""
        amenity = Amenity(name='Projector')
        self.assertEqual(str(amenity), 'Projector')

    def test_space_str(self):
        """Test the string representation of Space"""
        loc = Location(name='HQ', city='Kyiv', country='Ukraine')
        floor = Floor(location=loc, level=3)
        
        # Test meeting room
        space_room = Space(floor=floor, name='Room 1', space_type='meeting_room')
        self.assertEqual(str(space_room), 'Room 1 (Meeting Room) - HQ - Floor 3')
        
        # Test desk
        space_desk = Space(floor=floor, name='Desk 45', space_type='desk')
        self.assertEqual(str(space_desk), 'Desk 45 (Desk) - HQ - Floor 3')
        
        # Test private office
        space_office = Space(floor=floor, name='Office A', space_type='private_office')
        self.assertEqual(str(space_office), 'Office A (Private Office) - HQ - Floor 3')

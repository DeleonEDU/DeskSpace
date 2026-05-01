from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from spaces.models import Location, Floor, Amenity, Space

User = get_user_model()

class SpaceServiceIntegrationTests(APITestCase):
    def setUp(self):
        # Create a test user (staff for creation, normal for read-only)
        self.staff_user = User.objects.create_user(
            username='staff', email='staff@example.com', password='password', is_staff=True
        )
        self.normal_user = User.objects.create_user(
            username='user', email='user@example.com', password='password'
        )
        
        # URLs
        self.location_list_url = reverse('location-list')
        self.floor_list_url = reverse('floor-list')
        self.amenity_list_url = reverse('amenity-list')
        self.space_list_url = reverse('space-list')
        
        # Initial Data
        self.location = Location.objects.create(
            name='Main Office', address='123 Main St', city='Kyiv', country='Ukraine'
        )
        self.floor = Floor.objects.create(
            location=self.location, level=1, name='Ground Floor'
        )
        self.amenity = Amenity.objects.create(
            name='WiFi', icon_name='wifi'
        )
        self.space = Space.objects.create(
            floor=self.floor, name='Desk 1', space_type='desk', capacity=1, price_per_hour=10.00
        )
        self.space.amenities.add(self.amenity)

    def test_location_crud_as_staff(self):
        """Test Location CRUD operations by staff user"""
        self.client.force_authenticate(user=self.staff_user)
        
        # Create
        data = {'name': 'Branch Office', 'address': '456 Side St', 'city': 'Lviv', 'country': 'Ukraine'}
        response = self.client.post(self.location_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Location.objects.count(), 2)
        
        # Read
        response = self.client.get(self.location_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Update
        location_id = response.data[1]['id']
        detail_url = reverse('location-detail', args=[location_id])
        response = self.client.patch(detail_url, {'name': 'Updated Branch'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Location.objects.get(id=location_id).name, 'Updated Branch')
        
        # Delete
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Location.objects.count(), 1)

    def test_location_read_only_as_normal_user(self):
        """Test normal user can read but not create locations"""
        self.client.force_authenticate(user=self.normal_user)
        
        # Read
        response = self.client.get(self.location_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Create attempt
        data = {'name': 'Branch Office', 'address': '456 Side St', 'city': 'Lviv', 'country': 'Ukraine'}
        response = self.client.post(self.location_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_space_invalid_data(self):
        """Test creating a space with missing required fields fails"""
        self.client.force_authenticate(user=self.staff_user)
        
        invalid_data = {
            'floor': self.floor.id,
            'name': 'Invalid Space',
            # missing space_type, capacity, price_per_hour
        }
        response = self.client.post(self.space_list_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('space_type', response.data)
        self.assertIn('price_per_hour', response.data)

    def test_floor_filtering(self):
        """Test filtering floors by location and level"""
        self.client.force_authenticate(user=self.normal_user)
        
        # Create another floor
        Floor.objects.create(location=self.location, level=2, name='Second Floor')
        
        # Filter by location
        response = self.client.get(f"{self.floor_list_url}?location={self.location.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Filter by level
        response = self.client.get(f"{self.floor_list_url}?level=2")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['level'], 2)

    def test_space_filtering_and_search(self):
        """Test custom filters and search for spaces"""
        self.client.force_authenticate(user=self.normal_user)
        
        # Create another space
        Space.objects.create(
            floor=self.floor, name='Meeting Room A', description='Large room',
            space_type='meeting_room', capacity=10, price_per_hour=50.00,
            svg_element_id='room-a'
        )
        
        # Filter by space_type
        response = self.client.get(f"{self.space_list_url}?space_type=meeting_room")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Meeting Room A')
        
        # Filter by svg_id__in
        response = self.client.get(f"{self.space_list_url}?svg_id__in=room-a")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Search by name/description
        response = self.client.get(f"{self.space_list_url}?search=Large")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_space_inactive_visibility(self):
        """Test that inactive spaces are only visible to staff"""
        inactive_space = Space.objects.create(
            floor=self.floor, name='Broken Desk', space_type='desk', 
            capacity=1, price_per_hour=10.00, is_active=False
        )
        
        # Normal user shouldn't see inactive space
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(self.space_list_url)
        self.assertEqual(len(response.data), 1) # Only the active 'Desk 1'
        
        # Staff user should see it
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.space_list_url)
        self.assertEqual(len(response.data), 2)

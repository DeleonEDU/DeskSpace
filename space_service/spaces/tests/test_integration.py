from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from spaces.models import Amenity, Floor, Location, Space
from spaces.tests.test_helpers import authenticate_jwt


class SpaceServiceIntegrationTests(APITestCase):
    def setUp(self):
        authenticate_jwt(self.client, user_id=1, email="user@example.com", is_staff=False)
        self.normal_client = self.client
        self.staff_client = self.client.__class__()
        authenticate_jwt(self.staff_client, user_id=2, email="staff@example.com", is_staff=True)

        self.location_list_url = reverse("location-list")
        self.floor_list_url = reverse("floor-list")
        self.amenity_list_url = reverse("amenity-list")
        self.space_list_url = reverse("space-list")

        self.location = Location.objects.create(
            name="Main Office", address="123 Main St", city="Kyiv", country="Ukraine"
        )
        self.floor = Floor.objects.create(
            location=self.location, level=1, name="Ground Floor"
        )
        self.amenity = Amenity.objects.create(name="WiFi", icon_name="wifi")
        self.space = Space.objects.create(
            floor=self.floor,
            name="Desk 1",
            space_type="desk",
            capacity=1,
            price_per_hour=10.00,
        )
        self.space.amenities.add(self.amenity)

    def test_location_crud_as_staff(self):
        client = self.staff_client
        data = {
            "name": "Branch Office",
            "address": "456 Side St",
            "city": "Lviv",
            "country": "Ukraine",
        }
        response = client.post(self.location_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Location.objects.count(), 2)

        response = client.get(self.location_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        location_id = response.data[1]["id"]
        detail_url = reverse("location-detail", args=[location_id])
        response = client.patch(detail_url, {"name": "Updated Branch"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Location.objects.get(id=location_id).name, "Updated Branch")

        response = client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Location.objects.count(), 1)

    def test_location_read_only_as_normal_user(self):
        response = self.normal_client.get(self.location_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = {
            "name": "Branch Office",
            "address": "456 Side St",
            "city": "Lviv",
            "country": "Ukraine",
        }
        response = self.normal_client.post(self.location_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_space_invalid_data(self):
        invalid_data = {"floor": self.floor.id, "name": "Invalid Space"}
        response = self.staff_client.post(self.space_list_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("space_type", response.data)
        self.assertIn("price_per_hour", response.data)

    def test_floor_filtering(self):
        Floor.objects.create(location=self.location, level=2, name="Second Floor")

        response = self.normal_client.get(f"{self.floor_list_url}?location={self.location.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        response = self.normal_client.get(f"{self.floor_list_url}?level=2")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["level"], 2)

    def test_space_filtering_and_search(self):
        Space.objects.create(
            floor=self.floor,
            name="Meeting Room A",
            description="Large room",
            space_type="meeting_room",
            capacity=10,
            price_per_hour=50.00,
            svg_element_id="room-a",
        )

        response = self.normal_client.get(f"{self.space_list_url}?space_type=meeting_room")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Meeting Room A")

        response = self.normal_client.get(f"{self.space_list_url}?svg_id__in=room-a")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.normal_client.get(f"{self.space_list_url}?search=Large")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_space_inactive_visibility(self):
        Space.objects.create(
            floor=self.floor,
            name="Broken Desk",
            space_type="desk",
            capacity=1,
            price_per_hour=10.00,
            is_active=False,
        )

        response = self.normal_client.get(self.space_list_url)
        self.assertEqual(len(response.data), 1)

        response = self.staff_client.get(self.space_list_url)
        self.assertEqual(len(response.data), 2)

from unittest.mock import Mock, patch

from django.test import TestCase, override_settings

from bookings.clients.space_client import HttpSpaceClient
from bookings.domain.dtos import SpaceSnapshot
from bookings.domain.exceptions import SpaceServiceUnavailableError


@override_settings(
    SPACE_SERVICE_URL="http://space_service:8002",
    SPACE_SERVICE_HOST_HEADER="localhost",
    SPACE_SERVICE_TIMEOUT=5.0,
)
class HttpSpaceClientTests(TestCase):
    @patch("bookings.clients.space_client.requests.get")
    def test_fetch_space_builds_url_and_forwards_auth(self, mock_get):
        mock_get.return_value = Mock(
            status_code=200,
            json=lambda: {
                "id": 3,
                "is_active": True,
                "name": "Desk 3",
                "floor_level": 2,
            },
        )
        client = HttpSpaceClient()
        snapshot = client.fetch_space(3, "Bearer test-token")

        mock_get.assert_called_once_with(
            "http://space_service:8002/api/spaces/spaces/3/",
            headers={
                "Host": "localhost",
                "Authorization": "Bearer test-token",
            },
            timeout=5.0,
        )
        self.assertEqual(
            snapshot,
            SpaceSnapshot(id=3, is_active=True, name="Desk 3", floor=2),
        )

    @patch("bookings.clients.space_client.requests.get")
    def test_fetch_space_returns_none_on_404(self, mock_get):
        mock_get.return_value = Mock(status_code=404)
        client = HttpSpaceClient()
        self.assertIsNone(client.fetch_space(99, "Bearer t"))

    @patch("bookings.clients.space_client.requests.get")
    def test_fetch_space_raises_on_network_error(self, mock_get):
        import requests

        mock_get.side_effect = requests.ConnectionError("connection refused")
        client = HttpSpaceClient()
        with self.assertRaises(SpaceServiceUnavailableError):
            client.fetch_space(1, "Bearer t")

    @patch("bookings.clients.space_client.requests.get")
    def test_fetch_space_raises_on_unexpected_status(self, mock_get):
        mock_get.return_value = Mock(status_code=500, text="error")
        client = HttpSpaceClient()
        with self.assertRaises(SpaceServiceUnavailableError):
            client.fetch_space(1, None)

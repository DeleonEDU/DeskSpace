from typing import Protocol

import requests
from django.conf import settings

from bookings.domain.dtos import SpaceSnapshot
from bookings.domain.exceptions import SpaceServiceUnavailableError


class SpaceClient(Protocol):
    """Anti-Corruption Layer port — space data only via HTTP."""

    def fetch_space(self, space_id: int, auth_header: str | None) -> SpaceSnapshot | None:
        ...


class HttpSpaceClient(SpaceClient):
    def __init__(self, base_url: str | None = None, timeout: float | None = None):
        self.base_url = (base_url or settings.SPACE_SERVICE_URL).rstrip("/")
        self.timeout = timeout or settings.SPACE_SERVICE_TIMEOUT

    def fetch_space(self, space_id: int, auth_header: str | None) -> SpaceSnapshot | None:
        url = f"{self.base_url}/api/spaces/spaces/{space_id}/"
        headers = {"Authorization": auth_header} if auth_header else {}

        try:
            response = requests.get(url, headers=headers, timeout=self.timeout)
        except requests.RequestException as exc:
            raise SpaceServiceUnavailableError(
                "Space service is temporarily unavailable."
            ) from exc

        status_handlers = {
            200: lambda: SpaceSnapshot.from_api(response.json()),
            404: lambda: None,
        }
        handler = status_handlers.get(response.status_code)
        if handler:
            return handler()

        raise SpaceServiceUnavailableError(
            f"Space service returned unexpected status {response.status_code}."
        )

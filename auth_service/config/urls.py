from django.contrib import admin
from django.urls import include, path

from deskspace_common.health import health_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", lambda request: health_view(request, "auth_service")),
    path("api/auth/", include("users.urls")),
]

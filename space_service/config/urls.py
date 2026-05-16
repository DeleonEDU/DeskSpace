from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from deskspace_common.health import health_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", lambda request: health_view(request, "space_service")),
    path("api/spaces/", include("spaces.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, FloorViewSet, AmenityViewSet, SpaceViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'floors', FloorViewSet, basename='floor')
router.register(r'amenities', AmenityViewSet, basename='amenity')
router.register(r'spaces', SpaceViewSet, basename='space')

urlpatterns = [
    path('', include(router.urls)),
]

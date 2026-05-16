from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.serializers import DeskspaceTokenObtainPairSerializer
from users.views import ProfileView, UserRegisterView


class DeskspaceTokenObtainPairView(TokenObtainPairView):
    serializer_class = DeskspaceTokenObtainPairSerializer
    throttle_scope = "auth"


urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("token/", DeskspaceTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

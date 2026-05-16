import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from deskspace_auth.user import DummyUser

JWT_DECODE_ERRORS = {
    jwt.ExpiredSignatureError: "Token has expired",
    jwt.InvalidTokenError: "Invalid token",
}


class MicroserviceJWTAuthentication(authentication.BaseAuthentication):
    """Validates JWT using SECRET_KEY shared with auth_service only."""

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        parts = auth_header.split()
        bearer_valid = len(parts) == 2 and parts[0].lower() == "bearer"
        if not bearer_valid:
            return None

        token = parts[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as exc:
            raise exceptions.AuthenticationFailed(JWT_DECODE_ERRORS[type(exc)]) from exc

        missing_user_id = "user_id" not in payload
        if missing_user_id:
            raise exceptions.AuthenticationFailed(
                "Token contained no recognizable user identification"
            )

        return DummyUser(payload), token

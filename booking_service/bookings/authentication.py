import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

class DummyUser:
    """
    A lightweight User-like object for microservices.
    Instead of hitting the DB to find the user, we just trust the JWT payload
    if the signature is valid.
    """
    def __init__(self, payload):
        self.id = payload.get('user_id')
        self.email = payload.get('email', '')
        self.is_authenticated = True
        self.is_staff = payload.get('is_staff', False)
        
    def __str__(self):
        return f"User({self.id})"


class MicroserviceJWTAuthentication(authentication.BaseAuthentication):
    """
    Validates the JWT token using the SECRET_KEY shared with auth_service.
    Does NOT query the local database for the user.
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
            
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None
            
        token = parts[1]
        
        try:
            # We use HS256 and the Django SECRET_KEY by default
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            # In simplejwt, 'user_id' is standard
            if 'user_id' not in payload:
                raise exceptions.AuthenticationFailed('Token contained no recognizable user identification')
                
            user = DummyUser(payload)
            return (user, token)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

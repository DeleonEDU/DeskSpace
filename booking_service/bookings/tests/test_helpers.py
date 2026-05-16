from deskspace_auth.user import DummyUser


def authenticate_jwt(client, *, user_id=1, email="user@example.com", is_staff=False):
    client.force_authenticate(
        user=DummyUser({"user_id": user_id, "email": email, "is_staff": is_staff})
    )

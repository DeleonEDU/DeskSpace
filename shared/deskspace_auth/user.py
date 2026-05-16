class DummyUser:
    """JWT-backed user for microservices (no shared user database)."""

    def __init__(self, payload: dict):
        self.id = payload.get("user_id")
        self.email = payload.get("email", "")
        self.is_authenticated = True
        self.is_staff = payload.get("is_staff", False)

    def __str__(self):
        return f"User({self.id})"

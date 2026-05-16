from django.contrib.auth import get_user_model

from users.repositories.user_repository import UserRepository

User = get_user_model()

REGISTER_VALIDATORS = {
    "password_match": (
        lambda data: data.get("password") == data.get("password_confirmation"),
        "Passwords do not match",
    ),
    "email_unique": (
        lambda data, repo: not repo.email_exists(data.get("email", "")),
        "A user with this email already exists",
    ),
}


class AuthService:
    def __init__(self, repository: UserRepository | None = None):
        self.repository = repository or UserRepository()

    def validate_registration(self, data: dict) -> dict[str, str]:
        errors = {}
        match_check, match_msg = REGISTER_VALIDATORS["password_match"]
        if not match_check(data):
            errors["non_field_errors"] = match_msg

        unique_check, unique_msg = REGISTER_VALIDATORS["email_unique"]
        if not unique_check(data, self.repository):
            errors["email"] = unique_msg

        return errors

    def register_user(self, data: dict) -> User:
        validation_errors = self.validate_registration(data)
        if validation_errors:
            raise ValueError(validation_errors)

        payload = {
            "email": data["email"],
            "password": data["password"],
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "phone_number": data["phone_number"],
        }
        return self.repository.create_user(**payload)

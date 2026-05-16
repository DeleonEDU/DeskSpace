from django.contrib.auth import get_user_model

User = get_user_model()


class UserRepository:
    def create_user(self, **fields):
        return User.objects.create_user(**fields)

    def get_by_email(self, email: str):
        return User.objects.filter(email=email).first()

    def email_exists(self, email: str) -> bool:
        return User.objects.filter(email=email).exists()

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.services.auth_service import AuthService

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirmation = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "password_confirmation",
        ]

    def validate(self, attrs):
        errors = AuthService().validate_registration(attrs)
        if errors:
            raise serializers.ValidationError(errors)
        return attrs

    def create(self, validated_data):
        return AuthService().register_user(validated_data)


class DeskspaceTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["user_id"] = user.id
        token["email"] = user.email
        token["is_staff"] = user.is_staff
        return token

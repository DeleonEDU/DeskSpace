from django.test import TestCase
from users.serializers import RegisterSerializer

class RegisterSerializerTests(TestCase):
    def test_passwords_match(self):
        """Test serializer is valid when passwords match"""
        data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+380501234567',
            'password': 'password123',
            'password_confirmation': 'password123'
        }
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_passwords_mismatch(self):
        """Test serializer is invalid when passwords do not match"""
        data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+380501234567',
            'password': 'password123',
            'password_confirmation': 'wrongpassword'
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
        self.assertEqual(serializer.errors['non_field_errors'][0], 'Passwords do not match')

    def test_password_min_length(self):
        """Test serializer enforces minimum password length"""
        data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+380501234567',
            'password': 'short',
            'password_confirmation': 'short'
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
        self.assertIn('password_confirmation', serializer.errors)

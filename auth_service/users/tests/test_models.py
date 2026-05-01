from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user_successful(self):
        """Test creating a normal user with valid data"""
        user = User.objects.create_user(
            email='normal@user.com', 
            password='password123', 
            first_name='Normal', 
            last_name='User', 
            phone_number='+380501234567'
        )
        self.assertEqual(user.email, 'normal@user.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_no_email(self):
        """Test creating a user without an email raises ValueError"""
        with self.assertRaisesMessage(ValueError, 'Email is required'):
            User.objects.create_user(email='', password='password123')

    def test_create_superuser_successful(self):
        """Test creating a superuser with valid data"""
        admin = User.objects.create_superuser(
            email='super@user.com', 
            password='password123', 
            first_name='Super', 
            last_name='User', 
            phone_number='+380501234567'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_create_superuser_missing_is_staff(self):
        """Test creating a superuser with is_staff=False raises ValueError"""
        with self.assertRaisesMessage(ValueError, 'Superuser must have is_staff=True.'):
            User.objects.create_superuser(
                email='super@user.com', 
                password='password123', 
                is_staff=False
            )

    def test_create_superuser_missing_is_superuser(self):
        """Test creating a superuser with is_superuser=False raises ValueError"""
        with self.assertRaisesMessage(ValueError, 'Superuser must have is_superuser=True.'):
            User.objects.create_superuser(
                email='super@user.com', 
                password='password123', 
                is_superuser=False
            )

    def test_user_str_representation(self):
        """Test the string representation of the User model"""
        user = User(email='test@test.com', first_name='John', last_name='Doe')
        self.assertEqual(str(user), 'John Doe')

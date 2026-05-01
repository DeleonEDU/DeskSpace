from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthIntegrationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.profile_url = reverse('profile')
        
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'password_confirmation': 'testpassword123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+380501234567'
        }

    def test_user_registration(self):
        """Test user registration flow"""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'testuser@example.com')

    def test_user_registration_duplicate_email(self):
        """Test user registration fails with duplicate email"""
        self.client.post(self.register_url, self.user_data)
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_user_registration_password_mismatch(self):
        """Test user registration fails when passwords do not match"""
        invalid_data = self.user_data.copy()
        invalid_data['password_confirmation'] = 'wrongpassword'
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_user_registration_missing_fields(self):
        """Test user registration fails when required fields are missing"""
        invalid_data = {'email': 'missing@example.com', 'password': 'pass', 'password_confirmation': 'pass'}
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('first_name', response.data)
        self.assertIn('last_name', response.data)
        self.assertIn('phone_number', response.data)

    def test_user_login(self):
        """Test user login and token generation"""
        # Create user first
        create_data = self.user_data.copy()
        create_data.pop('password_confirmation')
        User.objects.create_user(**create_data)
        
        # Attempt login
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_invalid_credentials(self):
        """Test user login fails with wrong password"""
        create_data = self.user_data.copy()
        create_data.pop('password_confirmation')
        User.objects.create_user(**create_data)
        
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_retrieval_and_update(self):
        """Test accessing and updating user profile with token"""
        create_data = self.user_data.copy()
        create_data.pop('password_confirmation')
        user = User.objects.create_user(**create_data)
        
        # Login to get token
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        token = login_response.data['access']
        
        # Set auth header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Get profile
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])
        
        # Update profile
        update_data = {'first_name': 'UpdatedName'}
        response = self.client.patch(self.profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user.refresh_from_db()
        self.assertEqual(user.first_name, 'UpdatedName')

    def test_unauthorized_profile_access(self):
        """Test accessing profile without token fails"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

import os
import requests
import pytest
from datetime import datetime, timedelta

# Default base URL pointing to the API Gateway
BASE_URL = os.getenv("API_GATEWAY_URL", "http://localhost")

@pytest.fixture(scope="module")
def user_data():
    timestamp = int(datetime.now().timestamp())
    return {
        "email": f"e2e_user_{timestamp}@example.com",
        "password": "E2ePassword123!",
        "password_confirmation": "E2ePassword123!",
        "first_name": "E2E",
        "last_name": "Tester",
        "phone_number": "+380500000000"
    }

@pytest.fixture(scope="module")
def session():
    """Returns a requests session that will hold the JWT token."""
    return requests.Session()

def test_e2e_full_flow(session, user_data):
    """
    End-to-End test that simulates a user journey:
    1. Register a new user
    2. Login to obtain JWT
    3. Fetch available locations and spaces
    4. Check availability for a specific time
    5. Create a booking
    6. Verify the booking appears in the user's list
    7. Cancel the booking
    """
    
    # --- 1. Registration ---
    register_url = f"{BASE_URL}/api/auth/register/"
    try:
        reg_response = session.post(register_url, json=user_data)
        # If the API is not running, this will fail. We skip the test if connection refused.
    except requests.exceptions.ConnectionError:
        pytest.skip(f"API Gateway is not running at {BASE_URL}. Skipping E2E tests.")
        
    assert reg_response.status_code == 201, f"Registration failed: {reg_response.text}"
    
    # --- 2. Login ---
    login_url = f"{BASE_URL}/api/auth/token/"
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    login_response = session.post(login_url, json=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    
    tokens = login_response.json()
    access_token = tokens.get("access")
    assert access_token is not None
    
    # Set Authorization header for subsequent requests
    session.headers.update({"Authorization": f"Bearer {access_token}"})
    
    # --- 3. Fetch Locations and Spaces ---
    spaces_url = f"{BASE_URL}/api/spaces/spaces/"
    spaces_response = session.get(spaces_url)
    assert spaces_response.status_code == 200, f"Failed to fetch spaces: {spaces_response.text}"
    
    spaces = spaces_response.json()
    if not spaces:
        pytest.skip("No spaces available in the database to test booking. Please run seed.py first.")
        
    target_space = spaces[0]
    space_id = target_space["id"]
    
    # --- 4. Check Availability ---
    now = datetime.now()
    start_time = now + timedelta(days=2)
    end_time = start_time + timedelta(hours=2)
    
    check_url = f"{BASE_URL}/api/bookings/check_availability/"
    check_params = {
        "space_id": space_id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat()
    }
    check_response = session.get(check_url, params=check_params)
    assert check_response.status_code == 200
    assert check_response.json().get("available") is True, "Space should be available"
    
    # --- 5. Create Booking ---
    booking_url = f"{BASE_URL}/api/bookings/"
    booking_data = {
        "space_id": space_id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat()
    }
    booking_response = session.post(booking_url, json=booking_data)
    assert booking_response.status_code == 201, f"Booking creation failed: {booking_response.text}"
    
    booking = booking_response.json()
    booking_id = booking["id"]
    assert booking["status"] == "confirmed"
    
    # --- 6. Verify Booking in List ---
    list_response = session.get(booking_url)
    assert list_response.status_code == 200
    user_bookings = list_response.json()
    assert any(b["id"] == booking_id for b in user_bookings), "Created booking not found in user's list"
    
    # --- 7. Cancel Booking ---
    cancel_url = f"{BASE_URL}/api/bookings/{booking_id}/"
    cancel_response = session.delete(cancel_url)
    assert cancel_response.status_code == 204, f"Cancellation failed: {cancel_response.text}"
    
    # Verify status changed to cancelled
    verify_cancel_response = session.get(f"{BASE_URL}/api/bookings/{booking_id}/")
    assert verify_cancel_response.status_code == 200
    assert verify_cancel_response.json()["status"] == "cancelled"

import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase


class RegisterAPITest(APITestCase):
    register_url = reverse("user-register-api")

    def setUp(self) -> None:
        self.client = APIClient()
        self.user_data = {
            "email": "a@a.com",
            "password": "password",
            "full_name": "User A",
            "profile_photo_path": "path/to/profile/photo.jpg",
        }

    def test_register_api(self):
        register_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"],
            "full_name": self.user_data["full_name"],
        }
        response = self.client.post(self.register_url, data=json.dumps(register_data), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_api_invalid_data(self):
        response = self.client.post(self.register_url, data={}, content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

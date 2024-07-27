from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from identities.tests.factories import UserFactory


class ProfileAPITest(APITestCase):
    profile_url = reverse("user-profile-api")

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = UserFactory(
            email="test@example.com", full_name="Test User", profile_photo_path="path/to/profile/photo.jpg"
        )
        self.token = Token.objects.create(user=self.user)

    def test_get_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        response = self.client.get(self.profile_url)
        expected_data = {
            "id": str(self.user.id),
            "full_name": self.user.full_name,
            "email": self.user.email,
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_data)

    def test_get_profile_invalid_token(self):
        invalid_token = "invalid_token"
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {invalid_token}")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, 401)

    def test_get_profile_unauthenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION="")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, 401)

    def test_update_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response_data = {
            "full_name": "updated_name",
        }

        response = self.client.patch(self.profile_url, data=response_data, format="json")
        expected_data = {"full_name": response_data.get("full_name")}

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_data)

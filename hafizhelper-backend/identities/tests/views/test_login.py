import json
from collections import OrderedDict
from unittest import mock

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from identities.dataclasses import UserLoginDataClass
from identities.tests.factories import UserFactory


class LoginAPITest(APITestCase):
    login_url = reverse("user-login-api")

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = UserFactory(
            email="test@example.com",
            password="Password",
            full_name="Test User",
            profile_photo_path="path/to/profile/photo.jpg",
        )

    @mock.patch("identities.views.login.LoginService")
    @mock.patch("identities.serializers.LoginRequestSerializer")
    @mock.patch("identities.serializers.AuthResponseSerializer")
    def test_login_api(
        self,
        mock_auth_response_serializer: mock.Mock,
        mock_login_request_serializer: mock.Mock,
        mock_login_service: mock.Mock,
    ):
        mock_login_service.run.return_value = UserLoginDataClass(user=self.user, token="example_token")

        mock_login_request_serializer_instance = mock.MagicMock()
        mock_login_request_serializer_instance.is_valid.return_value = True
        mock_login_request_serializer.return_value = mock_login_request_serializer_instance

        mock_auth_response_serializer_instance = mock.MagicMock()
        mock_auth_response_serializer_instance.data = {
            "user": {"id": "sample_id", "full_name": "ahmadhi", "email": "ahmadhiprananta@gmail.com"},
            "token": "sample_token",
        }
        mock_auth_response_serializer.return_value = mock_auth_response_serializer_instance

        login_data = {"email": self.user.email, "password": self.user.password}
        response = self.client.post(self.login_url, data=json.dumps(login_data), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_login_service.run.assert_called_once_with(email=self.user.email, password=self.user.password)

        expected_response_data = {
            "user": OrderedDict(
                {
                    "id": str(self.user.id),
                    "full_name": self.user.full_name,
                    "email": self.user.email,
                }
            ),
            "token": "example_token",
        }

        self.assertEqual(response.data, expected_response_data)

    @mock.patch("identities.serializers.LoginRequestSerializer")
    def test_login_api_invalid_data(self, mock_login_request_serializer: mock.Mock):
        mock_login_request_serializer_instance = mock.MagicMock()
        mock_login_request_serializer_instance.is_valid.return_value = False
        mock_login_request_serializer_instance.errors = {"username": ["This field is required."]}
        mock_login_request_serializer.return_value = mock_login_request_serializer_instance

        response = self.client.post(self.login_url, data={}, content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

from unittest import mock

from django.db.models.query import QuerySet
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from bookmark.dataclasses import ListSurahBookmarkData
from bookmark.tests.factories import SurahBookmarkFactory
from bookmark.views.surah_bookmark import SurahBookmarkAPI
from commons.exceptions import BadRequestException
from identities.tests.factories import UserFactory


class SurahBookmarkAPITest(APITestCase):
    surah_bookmark_url = reverse("surah-bookmark-api")

    def setUp(self) -> None:
        self.view = SurahBookmarkAPI()
        self.client = APIClient()
        self.user = UserFactory()
        self.token = Token.objects.create(user=self.user)

    @mock.patch("bookmark.views.surah_bookmark.ListSurahBookmarkService")
    def test_get_method(self, mock_list_surah_bookmark_service: mock.Mock):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        mock_surah_bookmark_1 = SurahBookmarkFactory(surah="Al-Fatiha", surah_number=1, user=self.user)
        mock_surah_bookmark_2 = SurahBookmarkFactory(surah="Al-Baqarah", surah_number=2, user=self.user)

        mock_query_set = QuerySet(model=SurahBookmarkFactory)
        mock_query_set._result_cache = [mock_surah_bookmark_1, mock_surah_bookmark_2]

        mock_surah_bookmark_data = ListSurahBookmarkData(data=mock_query_set)
        mock_list_surah_bookmark_service.run.return_value = mock_surah_bookmark_data

        response = self.client.get(self.surah_bookmark_url)

        # Assertions
        self.assertEqual(response.status_code, 200)  # Assuming the response is always 200 on success
        self.assertEqual(len(response.data["data"]), 2)

        # Check if ListHistoryService.run() was called with the correct parameters
        mock_list_surah_bookmark_service.run.assert_called_once_with(user=mock.ANY)

    @mock.patch("bookmark.views.surah_bookmark.transaction.atomic")
    @mock.patch("bookmark.views.surah_bookmark.CreateSurahBookmarkService.run")
    def test_post_method(self, mock_create_service, mock_transaction):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Mock data for request and response
        request_data = {"surah": "Al-Fatiha", "surah_number": 1}
        response_data = {
            "id": "fb1d27c5-749b-4c5a-9267-05765b8d5e50",
            "surah": "Al-Fatiha",
            "surah_number": 1,
            "created_at": "2024-04-21T04:12:30.066619Z",
        }

        mock_response_serializer_instance = mock.Mock()
        mock_response_serializer_instance.data = response_data

        # Mock CreateSurahBookmarkService.run() response
        mock_create_service.return_value = response_data

        response = self.client.post(self.surah_bookmark_url, data=request_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, 200)  # Assuming response is successful
        mock_create_service.assert_called_once()
        self.assertEqual(response.data, response_data)

    @mock.patch("bookmark.views.surah_bookmark.CreateSurahBookmarkService.run")
    def test_post_method_missing_field(self, mock_create_service: mock.Mock):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        request_data = {"surah_number": 1}
        response = self.client.post(self.surah_bookmark_url, data=request_data, format="json")

        # Check if the request was unsuccessful
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual({"surah": ["This field is required."]}, response.data["errors"]["validation_error"])

    @mock.patch("bookmark.views.surah_bookmark.CreateSurahBookmarkService.run")
    def test_post_method_invalid_data_type(self, mock_create_service: mock.Mock):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        request_data = {"surah": "Al-Fatihah", "surah_number": "Invalid"}
        response = self.client.post(self.surah_bookmark_url, data=request_data, format="json")

        # Check if the request was unsuccessful
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            {"surah_number": ["A valid integer is required."]}, response.data["errors"]["validation_error"]
        )
        mock_create_service.assert_not_called()

    @mock.patch("bookmark.views.surah_bookmark.transaction.atomic")
    @mock.patch("bookmark.views.surah_bookmark.CreateSurahBookmarkService.run")
    def test_post_method_existing_bookmark(self, mock_create_service, mock_transaction):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Mock data for request
        request_data = {"surah": "Al-Fatiha", "surah_number": 1}

        mock_create_service.side_effect = BadRequestException("SurahBookmark with this data already exists.")

        response = self.client.post(self.surah_bookmark_url, data=request_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data,
            {
                "errors": {
                    "code": "error",
                    "error_message": "SurahBookmark with this data already exists.",
                    "validation_error": None,
                }
            },
        )

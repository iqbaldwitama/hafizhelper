from unittest import mock

from django.db.models.query import QuerySet
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from history.dataclasses import ListHistoryData
from history.tests.factories import ReadHistoryFactory
from history.views.history import HistoryAPI
from identities.tests.factories import UserFactory


class HistoryAPITest(APITestCase):
    history_url = reverse("history-api")

    def setUp(self) -> None:
        self.view = HistoryAPI()
        self.client = APIClient()
        self.user = UserFactory()
        self.token = Token.objects.create(user=self.user)

    @mock.patch("history.views.history.ListHistoryService")
    def test_get_method(self, mock_list_history_service: mock.Mock):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        mock_read_history_1 = ReadHistoryFactory(surah="Al-Fatiha", verse=1, surah_number=1, user=self.user)
        mock_read_history_2 = ReadHistoryFactory(surah="Al-Baqarah", verse=255, surah_number=2, user=self.user)

        mock_query_set = QuerySet(model=ReadHistoryFactory)
        mock_query_set._result_cache = [mock_read_history_1, mock_read_history_2]

        mock_history_data = ListHistoryData(data=mock_query_set)
        mock_list_history_service.run.return_value = mock_history_data

        response = self.client.get(self.history_url)

        # Assertions
        self.assertEqual(response.status_code, 200)  # Assuming the response is always 200 on success
        self.assertEqual(len(response.data["data"]), 2)

        # Check if ListHistoryService.run() was called with the correct parameters
        mock_list_history_service.run.assert_called_once()

    @mock.patch("history.views.history.transaction.atomic")
    @mock.patch("history.views.history.CreateReadHistoryService.run")
    def test_post_method(self, mock_create_service, mock_transaction):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Mock data for request and response
        request_data = {"surah": "Al-Fatiha", "verse": 1, "surah_number": 1}
        response_data = {
            "id": "fb1d27c5-749b-4c5a-9267-05765b8d5e50",
            "surah": "Al-Fatiha",
            "verse": 1,
            "surah_number": 1,
            "created_at": "2024-04-21T04:12:30.066619Z",
        }

        mock_response_serializer_instance = mock.Mock()
        mock_response_serializer_instance.data = response_data

        # Mock CreateReadHistoryService.run() response
        mock_create_service.return_value = response_data

        response = self.client.post(self.history_url, data=request_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, 200)  # Assuming response is successful
        mock_create_service.assert_called_once()
        self.assertEqual(response.data, response_data)

    @mock.patch("history.views.history.CreateReadHistoryService.run")
    def test_post_method_missing_field(self, mock_create_service: mock.Mock):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        request_data = {"verse": 286, "surah_number": 1}  # Missing 'verse' field
        response = self.client.post(self.history_url, data=request_data, format="json")

        # Check if the request was unsuccessful
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual({"surah": ["This field is required."]}, response.data["errors"]["validation_error"])

    @mock.patch("history.views.history.CreateReadHistoryService.run")
    def test_post_method_invalid_data_type(self, mock_create_service: mock.Mock):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        request_data = {"surah": "Al-Fatihah", "verse": "Invalid", "surah_number": 1}
        response = self.client.post(self.history_url, data=request_data, format="json")

        # Check if the request was unsuccessful
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual({"verse": ["A valid integer is required."]}, response.data["errors"]["validation_error"])
        mock_create_service.assert_not_called()

    def test_delete_method(self):
        response = self.client.delete(self.history_url, data=None)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIsNone(response.data)

from unittest import mock

from django.test import TestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from bookmark.models.bookmark import SurahBookmark
from bookmark.views.surah_bookmark import SurahBookmarkAPI
from identities.tests.factories import UserFactory


class SurahBookmarkDetailAPITest(TestCase):
    surah_bookmark_specific_url = reverse("surah-bookmark-specific-api", kwargs={"surah_number": 1})

    def setUp(self):
        self.view = SurahBookmarkAPI()
        self.client = APIClient()
        self.user = UserFactory()
        self.token = Token.objects.create(user=self.user)

    @mock.patch("bookmark.views.specific_surah_bookmark.GetSurahBookmarkService.run")
    def test_get_existing_bookmark(self, mock_run):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        mock_run.return_value = SurahBookmark(surah_number=1)

        response = self.client.get(self.surah_bookmark_specific_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["surah_number"], 1)

    @mock.patch("bookmark.views.specific_surah_bookmark.GetSurahBookmarkService.run")
    def test_get_non_existing_bookmark(self, mock_run):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        mock_run.return_value = None

        response = self.client.get(self.surah_bookmark_specific_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"error": "SurahBookmark not found"})

    @mock.patch("bookmark.views.specific_surah_bookmark.transaction.atomic")
    @mock.patch("bookmark.views.specific_surah_bookmark.DeleteSurahBookmarkService.run")
    def test_delete_method(self, mock_delete_service, mock_transaction):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Mock data for request and response
        request_data = {"surah_number": 1}
        response_data = "SurahBookmark with surah_number 1 has been deleted."

        # Mock DeleteSurahBookmarkService.run() response
        mock_delete_service.return_value = response_data

        response = self.client.delete(self.surah_bookmark_specific_url, data=request_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, 200)  # Assuming response is successful
        self.assertEqual(response.data, {"detail": response_data})
        mock_delete_service.assert_called_once_with(user=mock.ANY, surah_number=1)

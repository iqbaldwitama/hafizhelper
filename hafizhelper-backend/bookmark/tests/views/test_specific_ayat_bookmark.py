from unittest import mock

from django.test import TestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from bookmark.models.bookmark import AyatBookmark
from bookmark.views.ayat_bookmark import AyatBookmarkAPI
from identities.tests.factories import UserFactory


class AyatBookmarkDetailAPITest(TestCase):
    ayat_bookmark_specific_url = reverse("ayat-bookmark-specific-api", kwargs={"surah_number": 1, "ayat": 1})

    def setUp(self):
        self.view = AyatBookmarkAPI()
        self.client = APIClient()
        self.user = UserFactory()
        self.token = Token.objects.create(user=self.user)

    @mock.patch("bookmark.views.specific_ayat_bookmark.GetAyatBookmarkService.run")
    def test_get_existing_bookmark(self, mock_run):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        mock_run.return_value = AyatBookmark(surah_number=1, ayat=1)

        response = self.client.get(self.ayat_bookmark_specific_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["surah_number"], 1)
        self.assertEqual(response.data["ayat"], 1)

    @mock.patch("bookmark.views.specific_ayat_bookmark.GetAyatBookmarkService.run")
    def test_get_non_existing_bookmark(self, mock_run):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        mock_run.return_value = None

        response = self.client.get(self.ayat_bookmark_specific_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"error": "AyatBookmark not found"})

    @mock.patch("bookmark.views.specific_ayat_bookmark.transaction.atomic")
    @mock.patch("bookmark.views.specific_ayat_bookmark.DeleteAyatBookmarkService.run")
    def test_delete_method(self, mock_delete_service, mock_transaction):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Mock data for request and response
        request_data = {"surah_number": 1, "ayat": 1}
        response_data = "AyatBookmark with surah_number 1 and ayat 1 has been deleted."

        # Mock DeleteAyatBookmarkService.run() response
        mock_delete_service.return_value = response_data

        response = self.client.delete(self.ayat_bookmark_specific_url, data=request_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, 200)  # Assuming response is successful
        self.assertEqual(response.data, {"detail": response_data})
        mock_delete_service.assert_called_once_with(user=mock.ANY, surah_number=1, ayat=1)

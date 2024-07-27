from unittest.mock import patch

from django.test import TestCase

from bookmark.models.bookmark import AyatBookmark, SurahBookmark
from bookmark.services.read_bookmark import GetAyatBookmarkService, GetSurahBookmarkService
from identities.tests.factories import UserFactory


class GetSurahBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    @patch.object(SurahBookmark.objects, "get")
    def test_run_existing_bookmark(self, mock_get):
        mock_get.return_value = SurahBookmark(user=self.user, surah_number=1)

        result = GetSurahBookmarkService.run(user=self.user, surah_number=1)

        self.assertEqual(result.surah_number, 1)

    @patch.object(SurahBookmark.objects, "get")
    def test_run_non_existing_bookmark(self, mock_get):
        mock_get.side_effect = SurahBookmark.DoesNotExist

        result = GetSurahBookmarkService.run(user=self.user, surah_number=1)

        self.assertIsNone(result)


class GetAyatBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    @patch.object(AyatBookmark.objects, "get")
    def test_run_existing_bookmark(self, mock_get):
        mock_get.return_value = AyatBookmark(user=self.user, surah_number=1, ayat=1)

        result = GetAyatBookmarkService.run(user=self.user, surah_number=1, ayat=1)

        self.assertEqual(result.surah_number, 1)
        self.assertEqual(result.ayat, 1)

    @patch.object(AyatBookmark.objects, "get")
    def test_run_non_existing_bookmark(self, mock_get):
        mock_get.side_effect = AyatBookmark.DoesNotExist

        result = GetAyatBookmarkService.run(user=self.user, surah_number=1, ayat=1)

        self.assertIsNone(result)

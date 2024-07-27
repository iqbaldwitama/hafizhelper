from django.test import TestCase

from bookmark.dataclasses import CreateAyatBookmarkRequestData, CreateSurahBookmarkRequestData
from bookmark.models import AyatBookmark, SurahBookmark
from bookmark.services.create_bookmark import CreateAyatBookmarkService, CreateSurahBookmarkService
from bookmark.services.delete_bookmark import DeleteAyatBookmarkService, DeleteSurahBookmarkService
from identities.tests.factories import UserFactory


class DeleteAyatBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()
        self.request_data = CreateAyatBookmarkRequestData(user=self.user, surah="Al-Baqarah", surah_number=2, ayat=286)
        self.created_ayat_bookmark = CreateAyatBookmarkService.run(request_data=self.request_data)

    def test_run_method_deletes_ayat_bookmark(self):
        DeleteAyatBookmarkService.run(
            user=self.user, surah_number=self.created_ayat_bookmark.surah_number, ayat=self.created_ayat_bookmark.ayat
        )

        self.assertFalse(AyatBookmark.objects.filter(id=self.created_ayat_bookmark.id).exists())

    def test_run_method_returns_message_when_no_ayat_bookmark(self):
        message = DeleteAyatBookmarkService.run(user=self.user, surah_number=3, ayat=3)

        self.assertEqual(message, "No AyatBookmark found with surah_number 3 and ayat 3.")


class DeleteSurahBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()
        self.request_data = CreateSurahBookmarkRequestData(user=self.user, surah="Al-Baqarah", surah_number=2)
        self.created_surah_bookmark = CreateSurahBookmarkService.run(request_data=self.request_data)

    def test_run_method_deletes_surah_bookmark(self):
        DeleteSurahBookmarkService.run(user=self.user, surah_number=self.created_surah_bookmark.surah_number)

        self.assertFalse(SurahBookmark.objects.filter(id=self.created_surah_bookmark.id).exists())

    def test_run_method_returns_message_when_no_surah_bookmark(self):
        message = DeleteSurahBookmarkService.run(user=self.user, surah_number=3)

        self.assertEqual(message, "No SurahBookmark found with surah_number 3.")

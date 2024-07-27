from django.test import TestCase

from bookmark.dataclasses import CreateAyatBookmarkRequestData, CreateSurahBookmarkRequestData
from bookmark.models import AyatBookmark, SurahBookmark
from bookmark.services.create_bookmark import CreateAyatBookmarkService, CreateSurahBookmarkService
from commons.exceptions import BadRequestException
from identities.tests.factories import UserFactory


class CreateAyatBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()
        self.request_data = CreateAyatBookmarkRequestData(user=self.user, surah="Al-Baqarah", surah_number=2, ayat=286)

    def test_run_method_returns_response_data_with_correct_response(self):
        CreateAyatBookmarkService.run(request_data=self.request_data)

        created_ayat_bookmark = AyatBookmark.objects.first()
        self.assertIsNotNone(created_ayat_bookmark)

        self.assertEqual("Al-Baqarah", created_ayat_bookmark.surah)
        self.assertEqual(286, created_ayat_bookmark.ayat)
        self.assertEqual(2, created_ayat_bookmark.surah_number)

    def test_run_method_raises_value_error_when_ayat_bookmark_exists(self):
        CreateAyatBookmarkService.run(request_data=self.request_data)

        with self.assertRaises(BadRequestException):
            CreateAyatBookmarkService.run(request_data=self.request_data)


class CreateSurahBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()
        self.request_data = CreateSurahBookmarkRequestData(user=self.user, surah="Al-Baqarah", surah_number=2)

    def test_run_method_returns_response_data_with_correct_response(self):
        CreateSurahBookmarkService.run(request_data=self.request_data)

        created_surah_bookmark = SurahBookmark.objects.first()
        self.assertIsNotNone(created_surah_bookmark)

        self.assertEqual("Al-Baqarah", created_surah_bookmark.surah)
        self.assertEqual(2, created_surah_bookmark.surah_number)

    def test_run_method_raises_value_error_when_surah_bookmark_exists(self):
        CreateSurahBookmarkService.run(request_data=self.request_data)

        with self.assertRaises(BadRequestException):
            CreateSurahBookmarkService.run(request_data=self.request_data)

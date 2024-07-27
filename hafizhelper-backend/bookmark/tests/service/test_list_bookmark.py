from django.test import TestCase
from safedelete.queryset import SafeDeleteQueryset

from bookmark.services.list_bookmark import ListAyatBookmarkService, ListSurahBookmarkService
from bookmark.tests.factories import AyatBookmarkFactory, SurahBookmarkFactory
from identities.tests.factories import UserFactory


class ListAyatBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    def test_list_ayat_bookmark(self):
        self.ayatbookmark1 = AyatBookmarkFactory(surah="Al-Fatihah", ayat=1, surah_number=1, user=self.user)
        self.ayatbookmark2 = AyatBookmarkFactory(surah="Al-Baqarah", ayat=256, surah_number=2, user=self.user)
        self.ayatbookmark3 = AyatBookmarkFactory(surah="Al-Fatihah", ayat=2, surah_number=1, user=self.user)

        service_result = ListAyatBookmarkService.run(user=self.user)

        self.assertEqual(service_result.data.count(), 3)
        self.assertEqual("Al-Fatihah", service_result.data[2].surah)
        self.assertEqual("Al-Fatihah", service_result.data[0].surah)
        self.assertEqual("Al-Baqarah", service_result.data[1].surah)

        self.assertEqual(1, service_result.data[2].ayat)
        self.assertEqual(2, service_result.data[0].ayat)
        self.assertEqual(256, service_result.data[1].ayat)

    def test_list_ayat_bookmark_empty_list(self):
        service_result = ListAyatBookmarkService.run(user=self.user)

        # Assertions
        self.assertIsInstance(service_result.data, SafeDeleteQueryset)
        self.assertEqual(service_result.data.count(), 0)
        self.assertEqual(list(service_result.data), [])  # Empty list response

        self.assertFalse(service_result.data.exists())  # Assert queryset is empty


class ListSurahBookmarkServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    def test_list_history(self):
        self.surahbookmark1 = SurahBookmarkFactory(surah="Al-Fatihah", surah_number=1, user=self.user)
        self.surahbookmark2 = SurahBookmarkFactory(surah="Al-Baqarah", surah_number=2, user=self.user)

        service_result = ListSurahBookmarkService.run(user=self.user)

        self.assertEqual(service_result.data.count(), 2)
        self.assertEqual("Al-Fatihah", service_result.data[1].surah)
        self.assertEqual("Al-Baqarah", service_result.data[0].surah)

    def test_list_surah_bookmark_empty_list(self):
        service_result = ListSurahBookmarkService.run(user=self.user)

        # Assertions
        self.assertIsInstance(service_result.data, SafeDeleteQueryset)
        self.assertEqual(service_result.data.count(), 0)
        self.assertEqual(list(service_result.data), [])  # Empty list response

        self.assertFalse(service_result.data.exists())  # Assert queryset is empty

from datetime import datetime, timedelta
from unittest import mock

from django.test import TestCase
from django.utils.timezone import make_aware

from history.models import ReadHistory
from history.services.delete_history import DeleteReadHistoryService
from history.tests.factories import ReadHistoryFactory
from identities.tests.factories import UserFactory

MOCKED_NOW = make_aware(datetime(2023, 8, 17, 2, 0, 0))


class DeleteReadHistoryServiceTest(TestCase):
    def setUp(self) -> None:
        self.user_1 = UserFactory()
        self.user_2 = UserFactory()

    @mock.patch("django.utils.timezone.now")
    def test_run_method_with_threshold_date_will_returns_empty_query(self, mock_timezone_now: mock.Mock):
        mock_timezone_now.return_value = MOCKED_NOW

        read_history = ReadHistoryFactory(user=self.user_1, surah="Al-Baqarah", surah_number=2, verse=286)
        read_history.created_at = MOCKED_NOW - timedelta(days=31)
        read_history.save()

        read_history = ReadHistoryFactory(user=self.user_2, surah="Al-Baqarah", surah_number=2, verse=200)
        read_history.created_at = MOCKED_NOW - timedelta(days=61)
        read_history.save()

        DeleteReadHistoryService.run()

        list_read_history = ReadHistory.objects.all()
        self.assertEqual(0, len(list_read_history))

    @mock.patch("django.utils.timezone.now")
    def test_run_method_not_yet_threshold_date_will_returns_objects_query(self, mock_timezone_now: mock.Mock):
        mock_timezone_now.return_value = MOCKED_NOW

        read_history = ReadHistoryFactory(user=self.user_1, surah="Al-Baqarah", surah_number=2, verse=286)
        read_history.created_at = MOCKED_NOW - timedelta(days=2)
        read_history.save()

        read_history = ReadHistoryFactory(user=self.user_2, surah="Al-Baqarah", surah_number=2, verse=200)
        read_history.created_at = MOCKED_NOW - timedelta(days=30)
        read_history.save()

        DeleteReadHistoryService.run()

        list_read_history = ReadHistory.objects.all()
        self.assertEqual(2, len(list_read_history))

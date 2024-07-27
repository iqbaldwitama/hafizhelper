from datetime import datetime, timedelta
from unittest import mock

from django.test import TestCase
from django.utils.timezone import make_aware

from history.dataclasses import CreateHistoryRequestData
from history.models import ReadHistory
from history.services.create_history import CreateReadHistoryService
from history.services.list_history import ListHistoryService
from history.tests.factories import ReadHistoryFactory
from identities.tests.factories import UserFactory

MOCKED_NOW = make_aware(datetime(2023, 8, 17, 2, 0, 0))


class CreateReadHistoryServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    def test_run_method_returns_response_data_with_correct_response(self):
        self.request_data_1 = CreateHistoryRequestData(user=self.user, surah="Al-Baqarah", surah_number=2, verse=286)
        CreateReadHistoryService.run(request_data=self.request_data_1)

        created_read_history = ReadHistory.objects.first()
        self.assertIsNotNone(created_read_history)

        self.assertEqual("Al-Baqarah", created_read_history.surah)
        self.assertEqual(286, created_read_history.verse)
        self.assertEqual(2, created_read_history.surah_number)

    @mock.patch("django.utils.timezone.now")
    def test_run_method_with_already_has_filtered_object(self, mock_timezone_now):
        mock_timezone_now.return_value = MOCKED_NOW

        self.request_data_1 = CreateHistoryRequestData(user=self.user, surah="Al-Baqarah", surah_number=2, verse=286)
        self.request_data_2 = CreateHistoryRequestData(user=self.user, surah="Al-Baqarah", surah_number=2, verse=286)

        CreateReadHistoryService.run(request_data=self.request_data_1)
        CreateReadHistoryService.run(request_data=self.request_data_2)

        service_result = ListHistoryService.run(user=self.user)
        self.assertEqual(service_result.data.count(), 1)

        self.request_data_3 = ReadHistoryFactory(user=self.user, surah="Al-Baqarah", surah_number=2, verse=286)
        self.request_data_3.created_at = MOCKED_NOW + timedelta(days=1)
        self.request_data_3.save()

        CreateReadHistoryService.run(request_data=self.request_data_3)

        service_result = ListHistoryService.run(user=self.user)
        self.assertEqual(service_result.data.count(), 2)

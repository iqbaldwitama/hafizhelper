from django.test import TestCase
from safedelete.queryset import SafeDeleteQueryset

from history.services.list_history import ListHistoryService
from history.tests.factories import ReadHistoryFactory
from identities.tests.factories import UserFactory


class ListHistoryServiceTest(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()
        self.user_2 = UserFactory()

    def test_list_history(self):
        self.history_1 = ReadHistoryFactory(surah="Al-Fatihah", verse=1, surah_number=1, user=self.user)
        self.history_2 = ReadHistoryFactory(surah="Al-Baqarah", verse=256, surah_number=2, user=self.user)

        service_result = ListHistoryService.run(user=self.user)

        self.assertEqual(service_result.data.count(), 2)
        self.assertEqual("Al-Fatihah", service_result.data[1].surah)
        self.assertEqual("Al-Baqarah", service_result.data[0].surah)

        self.assertEqual(1, service_result.data[1].verse)
        self.assertEqual(256, service_result.data[0].verse)

    # @mock.patch('your_app.views.ListHistoryService.run')
    def test_list_read_history_empty_list(self):
        service_result = ListHistoryService.run(user=self.user)

        # Assertions
        self.assertIsInstance(service_result.data, SafeDeleteQueryset)
        self.assertEqual(service_result.data.count(), 0)
        self.assertEqual(list(service_result.data), [])  # Empty list response

        self.assertFalse(service_result.data.exists())  # Assert queryset is empty

    def test_list_read_history_different_user(self):
        self.history_1 = ReadHistoryFactory(surah="Al-Fatihah", verse=1, surah_number=1, user=self.user)
        self.history_2 = ReadHistoryFactory(surah="Al-Baqarah", verse=256, surah_number=2, user=self.user_2)
        service_result_1 = ListHistoryService.run(user=self.user)
        service_result_2 = ListHistoryService.run(user=self.user_2)

        # Assertions
        self.assertEqual(service_result_1.data.count(), 1)
        self.assertEqual(service_result_2.data.count(), 1)

from unittest import mock

from django.test import TestCase

from commons.exceptions import BadRequestException
from identities.constants import EMPTY_NAME_FIELD
from identities.services.update_profile import UpdateProfileResponseData, UpdateProfileService
from identities.tests.factories import UserFactory


class TestLoginService(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    @mock.patch("identities.models.User.save")
    def test_run_with_full_name(self, mock_save: mock.Mock):
        # Mock user object
        self.user.full_name = "Old Name"

        # Run the service with a full_name parameter
        updated_data = UpdateProfileService.run(user=self.user, full_name="New Name")

        # Assert that the user's full_name has been updated
        self.assertEqual(self.user.full_name, "New Name")
        self.assertIsInstance(updated_data, UpdateProfileResponseData)
        self.assertEqual(updated_data.full_name, "New Name")

        # Assert that self.user.save() is called when full_name is provided
        mock_save.assert_called_once()

    @mock.patch("identities.models.User.save")
    def test_run_without_changes(self, mock_save: mock.Mock):
        # Mock user object
        self.user.full_name = "Old Name"

        # Run the service without any changes
        updated_data = UpdateProfileService.run(user=self.user)

        # Assert that the user's full_name remains unchanged
        self.assertEqual(self.user.full_name, "Old Name")
        self.assertIsInstance(updated_data, UpdateProfileResponseData)
        self.assertEqual(updated_data.full_name, "Old Name")

        # Assert that self.user.save() is not called when no changes are provided
        mock_save.assert_not_called()

    @mock.patch("identities.models.User.save")
    def test_run_with_empty_full_name(self, mock_save: mock.Mock):
        self.user.full_name = "Old Name"

        # Attempt to run the service with an empty full_name
        with self.assertRaises(BadRequestException) as context:
            UpdateProfileService.run(user=self.user, full_name="")

        # Assert that the correct exception is raised with the correct message
        self.assertEqual(context.exception.detail, EMPTY_NAME_FIELD)

        # Assert that user.save() is not called when an exception is raised
        mock_save.assert_not_called()

from django.test import TestCase

from commons.exceptions import BadRequestException
from identities.constants import EMAIL_ALREADY_USE, MUST_HAVE_EMAIL
from identities.dataclasses import RegisterRequestData
from identities.services.registration import RegistrationService


class RegistrationServiceTest(TestCase):
    def setUp(self) -> None:
        self.user_data = {
            "email": "a@a.com",
            "password": "password",
            "full_name": "User A",
            "profile_photo_path": "path/to/profile/photo.jpg",
        }
        self.request_data = RegisterRequestData(
            full_name="User A", email="a@a.com", password="password", profile_photo_path="path/to/profile/photo.jpg"
        )

    def test_flow_success(self):
        user_data = RegistrationService.run(request_data=self.request_data)
        user = user_data.user
        for key, val in list(self.user_data.items())[:-1]:
            if key == "password":
                self.assertTrue(user.check_password(val))
                continue
            self.assertEqual(self.user_data[key], getattr(user, key))

    def test_flow_duplicate_email(self):
        RegistrationService.run(request_data=self.request_data)
        self.request_data.email = "a@a.com"

        self.assertRaisesMessage(
            BadRequestException, str(EMAIL_ALREADY_USE), lambda: RegistrationService.run(request_data=self.request_data)
        )

    def test_flow_no_email(self):
        self.request_data.email = None
        self.assertRaisesMessage(
            BadRequestException, str(MUST_HAVE_EMAIL), lambda: RegistrationService.run(request_data=self.request_data)
        )

from django.test import TestCase

from commons.exceptions import BadRequestException
from identities.constants import EMPTY_INPUT, WRONG_CREDENTIALS
from identities.dataclasses import RegisterRequestData
from identities.services.login import LoginService
from identities.services.registration import RegistrationService


class TestLoginService(TestCase):
    def setUp(self) -> None:
        self.request_data = RegisterRequestData(
            full_name="User A", email="a@a.com", password="password", profile_photo_path="path/to/profile/photo.jpg"
        )
        user_data = RegistrationService.run(request_data=self.request_data)
        self.user = user_data.user
        self.user.id = str(self.user.id)

    def test_flow_password_is_missing(self):
        self.assertRaisesMessage(
            BadRequestException,
            str(EMPTY_INPUT),
            lambda: LoginService.run(email=self.request_data.email, password=None),
        )

        self.assertRaisesMessage(
            BadRequestException,
            str(EMPTY_INPUT),
            lambda: LoginService.run(email=self.request_data.email, password=""),
        )

    def test_flow_wrong_credentials(self):
        self.assertRaisesMessage(
            BadRequestException,
            str(WRONG_CREDENTIALS),
            lambda: LoginService.run(
                email=self.request_data.email,
                password="123",
            ),
        )

        self.assertRaisesMessage(
            BadRequestException,
            str(WRONG_CREDENTIALS),
            lambda: LoginService.run(
                email="email@gmail.com",
                password=self.request_data.password,
            ),
        )

    def test_flow_correct_credentials(self):
        login_data = LoginService.run(email=self.request_data.email, password=self.request_data.password)

        self.assertEqual(self.user, login_data.user)

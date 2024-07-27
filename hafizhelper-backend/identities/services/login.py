from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from commons.exceptions import BadRequestException
from commons.patterns.runnable import Runnable
from identities.constants import EMPTY_INPUT, WRONG_CREDENTIALS
from identities.dataclasses import LoginDataClass, UserLoginDataClass
from identities.models import User


class LoginService(Runnable):
    @classmethod
    def generate_login_data(cls, user: User) -> LoginDataClass:
        token, _ = Token.objects.get_or_create(user=user)
        return LoginDataClass(token=token.key)

    @classmethod
    def run(cls, email: str, password: str) -> UserLoginDataClass:
        if not email or not password:
            raise BadRequestException(EMPTY_INPUT)

        # Handles wrong combination of email & password
        authenticated_user: User = authenticate(email=email, password=password)

        if not authenticated_user:
            raise BadRequestException(WRONG_CREDENTIALS)

        login_data = cls.generate_login_data(user=authenticated_user)

        return UserLoginDataClass(user=authenticated_user, token=login_data.token)

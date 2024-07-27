from django.db import IntegrityError

from commons.exceptions import BadRequestException
from commons.patterns.runnable import Runnable
from identities.constants import EMAIL_ALREADY_USE
from identities.dataclasses import RegisterRequestData, UserRegisterDataClass
from identities.models.user import User
from identities.services.login import LoginService


class RegistrationService(Runnable):
    @classmethod
    def run(
        cls,
        request_data: RegisterRequestData,
    ) -> UserRegisterDataClass:
        """
        Service for registering/creating user
        """
        try:
            user = User.objects.create_user(
                email=request_data.email,
                full_name=request_data.full_name,
                password=request_data.password,
            )
        except IntegrityError:
            raise BadRequestException(EMAIL_ALREADY_USE)
        except ValueError as e:
            raise BadRequestException(str(e))

        login_data = LoginService.generate_login_data(user)

        return UserRegisterDataClass(token=login_data.token, user=user)

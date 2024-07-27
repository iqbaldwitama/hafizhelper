from commons.exceptions import BadRequestException
from commons.patterns.runnable import Runnable
from identities.constants import EMPTY_NAME_FIELD
from identities.dataclasses import UpdateProfileResponseData
from identities.models import User


class UpdateProfileService(Runnable):
    @classmethod
    def run(cls, user: User, **kwargs) -> UpdateProfileResponseData:
        is_changed = False
        if "full_name" in kwargs:
            full_name = kwargs.get("full_name")
            if full_name == "":
                raise BadRequestException(EMPTY_NAME_FIELD)

            user.full_name = full_name
            is_changed = True

        if is_changed:
            user.save()

        return UpdateProfileResponseData(
            full_name=user.full_name,
        )

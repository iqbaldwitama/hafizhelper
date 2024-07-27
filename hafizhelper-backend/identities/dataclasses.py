import uuid
from typing import Optional

from commons.dataclasses import BaseDataClass
from identities.models import User


class UserLoginDataClass(BaseDataClass):
    user: User
    token: str

    class Config:
        arbitrary_types_allowed = True


class LoginDataClass(BaseDataClass):
    token: str


class UserProfileDataClass(BaseDataClass):
    id: uuid.UUID
    full_name: str
    email: str
    profile_photo_path: str


class UpdateProfileResponseData(BaseDataClass):
    full_name: Optional[str]


class UserRegisterDataClass(UserLoginDataClass):
    pass


class RegisterRequestData(BaseDataClass):
    full_name: str
    email: str
    password: str

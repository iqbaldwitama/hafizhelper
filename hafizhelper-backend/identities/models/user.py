import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, PermissionsMixin
from django.db import models

from commons.base_model import BaseModel
from identities.constants import MUST_HAVE_EMAIL


class UserManager(BaseUserManager):
    def create_user(self, email, full_name="", is_active=True, profile_photo_path="", password=None):
        if not email:
            raise ValueError(MUST_HAVE_EMAIL)

        user = self.model(email=self.normalize_email(email))
        user.full_name = full_name
        user.is_active = is_active
        user.profile_photo_path = profile_photo_path

        if password:
            user.set_password(password)

        user.save()

        return user

    def create_superuser(self, email, full_name="", password=None):
        user = self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            is_active=True,
        )

        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    id = models.CharField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=256)
    email = models.EmailField(unique=True, db_index=True)
    profile_photo_path = models.TextField()
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    class Meta:
        db_table = "user"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.full_name

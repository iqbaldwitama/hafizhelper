import factory

from identities.models.user import User


class UserFactory(factory.django.DjangoModelFactory):
    full_name = factory.Sequence(lambda n: f"User {n}")
    email = factory.Sequence(lambda n: f"email{n}@email.com")
    profile_photo_path = factory.Sequence(lambda n: f"Path/Photo/{n}")
    password = factory.Sequence(lambda n: f"Password{n}")
    is_superuser = False

    class Meta:
        model = User
        django_get_or_create = ("email",)

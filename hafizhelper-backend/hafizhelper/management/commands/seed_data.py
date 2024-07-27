import random
import string

from django.core.management import BaseCommand

from helloworld.models import HelloWorld


def random_string(length: int = 10) -> str:
    """Generate a random string of the specified length."""
    characters = string.ascii_letters + string.digits
    return "".join(random.choice(characters) for _ in range(length))


class Command(BaseCommand):
    def add_arguments(self, parser) -> None:
        parser.add_argument("--environment", type=str, help="Environment flag (dev, staging, prod)")

    def handle(self, *args, **kwargs) -> None:
        self.stdout.write("Start seeding database...")
        environment = kwargs["environment"]

        if environment == "dev":
            for _ in range(5):
                random_message = random_string()
                HelloWorld.objects.create(message=random_message)

            HelloWorld.objects.create(message="Hello World Development")

            self.stdout.write(self.style.SUCCESS("Data seeded successfully for development environment"))

        elif environment == "staging":
            HelloWorld.objects.create(message="Hello World Staging")
            self.stdout.write(self.style.SUCCESS("Data seeded successfully for staging environment"))

        elif environment == "prod":
            HelloWorld.objects.create(message="Hello World Production")
            self.stdout.write(self.style.SUCCESS("Data seeded successfully for production environment"))

        else:
            self.stdout.write(self.style.ERROR("Invalid environment specified"))

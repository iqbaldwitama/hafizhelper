import factory

from helloworld.models import HelloWorld


class HelloWorldFactory(factory.django.DjangoModelFactory):
    message = factory.Sequence(lambda n: f"Message {n}")

    class Meta:
        model = HelloWorld

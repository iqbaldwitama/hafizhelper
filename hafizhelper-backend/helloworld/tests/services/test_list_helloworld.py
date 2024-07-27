from django.test import TestCase

from helloworld.services.list_helloworld import ListHelloWorldService
from helloworld.tests.factories import HelloWorldFactory


class ListHelloWorldServiceTest(TestCase):
    def setUp(self) -> None:
        self.hello_world1 = HelloWorldFactory(message="message1")
        self.hello_world2 = HelloWorldFactory(message="message2")

    def test_list_hello_worlds(self):
        service_result = ListHelloWorldService.run()

        self.assertEqual(service_result.data.count(), 2)
        self.assertEqual("message1", service_result.data[1].message)
        self.assertEqual("message2", service_result.data[0].message)

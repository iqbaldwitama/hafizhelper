from django.test import TestCase

from helloworld.dataclasses import CreateHelloWorldRequestData, CreateHelloWorldResponseData
from helloworld.models import HelloWorld
from helloworld.services.create_helloworld import CreateHelloWorldService


class CreateHelloWorldServiceTest(TestCase):
    def setUp(self) -> None:
        self.request_data = CreateHelloWorldRequestData(message="Test Message")

    def test_run_method_returns_response_data_with_correct_response(self):
        actual_response = CreateHelloWorldService.run(request_data=self.request_data)

        created_hello_world = HelloWorld.objects.first()
        # Check hello_world are created
        self.assertIsNotNone(created_hello_world)

        expected_response = CreateHelloWorldResponseData(
            id=created_hello_world.id, message=created_hello_world.message, created_at=created_hello_world.created_at
        )
        self.assertEqual(expected_response, actual_response)

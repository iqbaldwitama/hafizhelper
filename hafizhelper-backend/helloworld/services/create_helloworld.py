from commons.patterns.runnable import Runnable
from helloworld.dataclasses import CreateHelloWorldRequestData, CreateHelloWorldResponseData
from helloworld.models import HelloWorld


class CreateHelloWorldService(Runnable):
    @classmethod
    def run(cls, request_data: CreateHelloWorldRequestData) -> CreateHelloWorldResponseData:
        new_hello_world = HelloWorld.objects.create(message=request_data.message)

        return CreateHelloWorldResponseData(
            id=new_hello_world.id, message=new_hello_world.message, created_at=new_hello_world.created_at
        )

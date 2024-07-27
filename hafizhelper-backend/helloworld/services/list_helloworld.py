from commons.patterns.runnable import Runnable
from helloworld.dataclasses import ListHelloWorldData
from helloworld.models import HelloWorld


class ListHelloWorldService(Runnable):
    @classmethod
    def run(cls) -> ListHelloWorldData:
        list_hello_world = HelloWorld.objects.all().order_by("-created_at")

        return ListHelloWorldData(data=list_hello_world)

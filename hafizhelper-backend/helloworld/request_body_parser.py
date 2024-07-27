from typing import OrderedDict

from helloworld.dataclasses import CreateHelloWorldRequestData


def parse_create_hello_world_request_data(request_data: OrderedDict) -> CreateHelloWorldRequestData:
    return CreateHelloWorldRequestData(message=request_data.get("message"))

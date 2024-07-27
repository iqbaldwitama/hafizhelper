from typing import OrderedDict

from identities.dataclasses import RegisterRequestData


def parse_register_user_request_data(request_data: OrderedDict) -> RegisterRequestData:
    return RegisterRequestData(
        full_name=request_data.get("full_name"),
        email=request_data.get("email"),
        password=request_data.get("password"),
    )

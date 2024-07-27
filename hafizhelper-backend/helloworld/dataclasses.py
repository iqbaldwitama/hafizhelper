from datetime import datetime
from uuid import UUID

from django.db.models import QuerySet

from commons.dataclasses import BaseDataClass
from helloworld.models.helloworld import HelloWorld


class ListHelloWorldData(BaseDataClass):
    data: QuerySet[HelloWorld]

    class Config:
        arbitrary_types_allowed = True


class CreateHelloWorldRequestData(BaseDataClass):
    message: str


class CreateHelloWorldResponseData(BaseDataClass):
    id: UUID
    message: str
    created_at: datetime

import uuid
from datetime import datetime

from django.db.models import QuerySet

from commons.dataclasses import BaseDataClass
from history.models.history import ReadHistory
from identities.models import User


class ListHistoryData(BaseDataClass):
    data: QuerySet[ReadHistory]

    class Config:
        arbitrary_types_allowed = True


class CreateHistoryRequestData(BaseDataClass):
    user: User
    surah: str
    verse: int
    surah_number: int

    class Config:
        arbitrary_types_allowed = True


class CreateHistoryResponseData(BaseDataClass):
    id: uuid.UUID
    surah: str
    verse: int
    surah_number: int
    created_at: datetime

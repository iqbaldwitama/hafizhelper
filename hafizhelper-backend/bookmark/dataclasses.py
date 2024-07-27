import uuid
from datetime import datetime

from django.db.models import QuerySet

from bookmark.models.bookmark import AyatBookmark, SurahBookmark
from commons.dataclasses import BaseDataClass
from identities.models import User


class ListSurahBookmarkData(BaseDataClass):
    data: QuerySet[SurahBookmark]

    class Config:
        arbitrary_types_allowed = True


class CreateSurahBookmarkRequestData(BaseDataClass):
    user: User
    surah: str
    surah_number: int

    class Config:
        arbitrary_types_allowed = True


class CreateSurahBookmarkResponseData(BaseDataClass):
    id: uuid.UUID
    surah: str
    surah_number: int
    created_at: datetime


class ListAyatBookmarkData(BaseDataClass):
    data: QuerySet[AyatBookmark]

    class Config:
        arbitrary_types_allowed = True


class CreateAyatBookmarkRequestData(BaseDataClass):
    user: User
    surah: str
    ayat: int
    surah_number: int

    class Config:
        arbitrary_types_allowed = True


class CreateAyatBookmarkResponseData(BaseDataClass):
    id: uuid.UUID
    surah: str
    ayat: int
    surah_number: int
    created_at: datetime

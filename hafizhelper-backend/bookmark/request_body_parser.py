from typing import OrderedDict

from bookmark.dataclasses import CreateAyatBookmarkRequestData, CreateSurahBookmarkRequestData
from identities.models import User


def parse_create_surah_bookmark_request_data(user: User, request_data: OrderedDict) -> CreateSurahBookmarkRequestData:
    return CreateSurahBookmarkRequestData(
        surah=request_data.get("surah"),
        surah_number=request_data.get("surah_number"),
        user=user,
    )


def parse_create_ayat_bookmark_request_data(user: User, request_data: OrderedDict) -> CreateAyatBookmarkRequestData:
    return CreateAyatBookmarkRequestData(
        surah=request_data.get("surah"),
        ayat=request_data.get("ayat"),
        surah_number=request_data.get("surah_number"),
        user=user,
    )

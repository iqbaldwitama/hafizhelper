from bookmark.dataclasses import (
    CreateAyatBookmarkRequestData,
    CreateAyatBookmarkResponseData,
    CreateSurahBookmarkRequestData,
    CreateSurahBookmarkResponseData,
)
from bookmark.models import AyatBookmark, SurahBookmark
from commons.exceptions import BadRequestException  # import BadRequestException from commons
from commons.patterns.runnable import Runnable


class CreateSurahBookmarkService(Runnable):
    @classmethod
    def run(cls, request_data: CreateSurahBookmarkRequestData) -> CreateSurahBookmarkResponseData:
        surah_bookmark, created = SurahBookmark.objects.get_or_create(
            surah=request_data.surah,
            surah_number=request_data.surah_number,
            user=request_data.user,
        )

        if not created:
            raise BadRequestException("SurahBookmark with this data already exists.")

        return CreateSurahBookmarkResponseData(
            id=surah_bookmark.id,
            surah=surah_bookmark.surah,
            surah_number=surah_bookmark.surah_number,
            created_at=surah_bookmark.created_at,
        )


class CreateAyatBookmarkService(Runnable):
    @classmethod
    def run(cls, request_data: CreateAyatBookmarkRequestData) -> CreateAyatBookmarkResponseData:
        ayat_bookmark, created = AyatBookmark.objects.get_or_create(
            surah=request_data.surah,
            ayat=request_data.ayat,
            surah_number=request_data.surah_number,
            user=request_data.user,
        )

        if not created:
            raise BadRequestException("AyatBookmark with this data already exists.")

        return CreateAyatBookmarkResponseData(
            id=ayat_bookmark.id,
            surah=ayat_bookmark.surah,
            ayat=ayat_bookmark.ayat,
            surah_number=ayat_bookmark.surah_number,
            created_at=ayat_bookmark.created_at,
        )

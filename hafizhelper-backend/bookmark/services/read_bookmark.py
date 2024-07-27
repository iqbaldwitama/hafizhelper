from django.core.exceptions import ObjectDoesNotExist

from bookmark.models.bookmark import AyatBookmark, SurahBookmark
from commons.patterns.runnable import Runnable
from identities.models.user import User


class GetSurahBookmarkService(Runnable):
    @classmethod
    def run(cls, user: User, surah_number: int) -> SurahBookmark:
        try:
            surah_bookmark = SurahBookmark.objects.get(user=user, surah_number=surah_number)
        except ObjectDoesNotExist:
            surah_bookmark = None

        return surah_bookmark


class GetAyatBookmarkService(Runnable):
    @classmethod
    def run(cls, user, surah_number: int, ayat: int) -> AyatBookmark:
        try:
            ayat_bookmark = AyatBookmark.objects.get(user=user, surah_number=surah_number, ayat=ayat)
        except ObjectDoesNotExist:
            ayat_bookmark = None

        return ayat_bookmark

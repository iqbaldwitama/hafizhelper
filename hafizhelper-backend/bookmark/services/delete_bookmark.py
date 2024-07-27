from bookmark.models import AyatBookmark, SurahBookmark
from commons.patterns.runnable import Runnable
from identities.models.user import User


class DeleteSurahBookmarkService(Runnable):
    @classmethod
    def run(cls, user: User, surah_number: int) -> str:
        try:
            surah_bookmark = SurahBookmark.objects.get(user=user, surah_number=surah_number)
            surah_bookmark.delete()
            return f"SurahBookmark with surah_number {surah_number} has been deleted."
        except SurahBookmark.DoesNotExist:
            return f"No SurahBookmark found with surah_number {surah_number}."


class DeleteAyatBookmarkService(Runnable):
    @classmethod
    def run(cls, user: User, surah_number: int, ayat: int) -> str:
        try:
            ayat_bookmark = AyatBookmark.objects.get(user=user, surah_number=surah_number, ayat=ayat)
            ayat_bookmark.delete()
            return f"AyatBookmark with surah_number {surah_number} and ayat {ayat} has been deleted."
        except AyatBookmark.DoesNotExist:
            return f"No AyatBookmark found with surah_number {surah_number} and ayat {ayat}."

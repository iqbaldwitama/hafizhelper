from bookmark.dataclasses import ListAyatBookmarkData, ListSurahBookmarkData
from bookmark.models.bookmark import AyatBookmark, SurahBookmark
from commons.patterns.runnable import Runnable
from identities.models.user import User


class ListSurahBookmarkService(Runnable):
    @classmethod
    def run(cls, user: User) -> ListSurahBookmarkData:
        list_surah_bookmark = SurahBookmark.objects.filter(user=user).order_by("-created_at")

        return ListSurahBookmarkData(data=list_surah_bookmark)


class ListAyatBookmarkService(Runnable):
    @classmethod
    def run(cls, user: User) -> ListAyatBookmarkData:
        list_ayat_bookmark = AyatBookmark.objects.filter(user=user).order_by("-created_at")

        return ListAyatBookmarkData(data=list_ayat_bookmark)

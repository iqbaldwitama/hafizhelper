from django.urls import path  # noqa

from bookmark.views.ayat_bookmark import AyatBookmarkAPI
from bookmark.views.specific_ayat_bookmark import AyatBookmarkDetailAPI
from bookmark.views.specific_surah_bookmark import SurahBookmarkDetailAPI
from bookmark.views.surah_bookmark import SurahBookmarkAPI

bookmark_urls = [
    path("surah-bookmark", SurahBookmarkAPI.as_view(), name="surah-bookmark-api"),
    path("ayat-bookmark", AyatBookmarkAPI.as_view(), name="ayat-bookmark-api"),
    path("surah-bookmark/<int:surah_number>", SurahBookmarkDetailAPI.as_view(), name="surah-bookmark-specific-api"),
    path(
        "ayat-bookmark/<int:surah_number>/<int:ayat>",
        AyatBookmarkDetailAPI.as_view(),
        name="ayat-bookmark-specific-api",
    ),
]

urlpatterns = []
urlpatterns += bookmark_urls

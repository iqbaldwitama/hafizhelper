from django.contrib import admin

from bookmark.models import AyatBookmark, SurahBookmark


@admin.register(SurahBookmark)
class SurahBookmarkAdmin(admin.ModelAdmin):
    list_display = ["surah", "surah_number"]
    list_filter = ["surah", "surah_number"]

    ordering = ["-created_at"]


@admin.register(AyatBookmark)
class AyatBookmarkAdmin(admin.ModelAdmin):
    list_display = ["surah_number", "ayat"]
    list_filter = ["surah", "surah_number", "ayat"]

    ordering = ["-created_at"]

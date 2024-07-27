from django.contrib import admin

from history.models import ReadHistory


@admin.register(ReadHistory)
class ReadHistoryAdmin(admin.ModelAdmin):
    list_display = ["surah", "verse"]
    list_filter = ["surah", "verse"]

    ordering = ["-created_at"]

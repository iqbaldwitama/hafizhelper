from django.db import models
from django.utils.translation import gettext_lazy as _

from commons.base_model import BaseModel


class SurahBookmark(BaseModel):
    user = models.ForeignKey(to="identities.User", on_delete=models.CASCADE, related_name="user_surah_bookmark")
    surah = models.CharField(max_length=255)
    surah_number = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.surah_name} (Surah No. {self.surah_number}) - {self.user.username}"

    class Meta:
        db_table = "surah_bookmark"
        verbose_name = _("surah Bookmark")
        verbose_name_plural = _("surah Bookmarks")


class AyatBookmark(BaseModel):
    user = models.ForeignKey(to="identities.User", on_delete=models.CASCADE, related_name="user_ayat_bookmark")
    surah = models.CharField(max_length=255)
    surah_number = models.PositiveIntegerField()
    ayat = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.surah_name} {self.ayat_number}:{self.surah_number} - {self.user.username}"

    class Meta:
        db_table = "ayat_bookmark"
        verbose_name = _("Ayat Bookmark")
        verbose_name_plural = _("Ayat Bookmarks")

from django.db import models
from django.utils.translation import gettext_lazy as _

from commons.base_model import BaseModel


class ReadHistory(BaseModel):
    surah = models.CharField(max_length=32)
    verse = models.PositiveIntegerField()
    surah_number = models.PositiveIntegerField()
    user = models.ForeignKey(to="identities.User", on_delete=models.CASCADE, related_name="user_read_history")

    def __str__(self):
        return f"{self.surah} - {self.verse}"

    class Meta:
        db_table = "read_history"
        verbose_name = _("Read History")
        verbose_name_plural = _("Read Histories")

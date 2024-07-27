from django.db import models
from django.utils.translation import gettext_lazy as _

from commons.base_model import BaseModel


class HelloWorld(BaseModel):
    message = models.CharField(max_length=255)

    def __str__(self):
        return self.message

    class Meta:
        db_table = "hello_world"
        verbose_name = _("Hello World")
        verbose_name_plural = _("Hello Worlds")

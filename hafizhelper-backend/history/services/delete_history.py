from datetime import timedelta

from django.utils import timezone
from safedelete import SOFT_DELETE_CASCADE

from commons.patterns.runnable import Runnable
from history.models import ReadHistory


class DeleteReadHistoryService(Runnable):
    @classmethod
    def run(cls) -> None:
        threshold_day = timezone.now() - timedelta(days=30)

        ReadHistory.objects.filter(created_at__lt=threshold_day).delete(force_policy=SOFT_DELETE_CASCADE)

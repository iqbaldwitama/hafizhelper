from commons.patterns.runnable import Runnable
from history.dataclasses import ListHistoryData
from history.models.history import ReadHistory
from identities.models import User


class ListHistoryService(Runnable):
    @classmethod
    def run(cls, user: User) -> ListHistoryData:
        list_hello_world = ReadHistory.objects.filter(user=user).order_by("-created_at")

        return ListHistoryData(data=list_hello_world)

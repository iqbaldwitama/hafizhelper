from django.utils import timezone

from commons.patterns.runnable import Runnable
from history.dataclasses import CreateHistoryRequestData, CreateHistoryResponseData
from history.models import ReadHistory


class CreateReadHistoryService(Runnable):
    @classmethod
    def run(cls, request_data: CreateHistoryRequestData) -> CreateHistoryResponseData:
        current_datetime = timezone.now()
        current_day = current_datetime.day

        read_history = ReadHistory.objects.filter(
            surah=request_data.surah,
            verse=request_data.verse,
            surah_number=request_data.surah_number,
            user=request_data.user,
            created_at__day=current_day,
        ).first()
        if not read_history:
            read_history = ReadHistory.objects.create(
                surah=request_data.surah,
                verse=request_data.verse,
                surah_number=request_data.surah_number,
                user=request_data.user,
            )
        else:
            read_history.created_at = current_datetime
            read_history.save()

        return CreateHistoryResponseData(
            id=read_history.id,
            surah=read_history.surah,
            verse=read_history.verse,
            surah_number=read_history.surah_number,
            created_at=read_history.created_at,
        )

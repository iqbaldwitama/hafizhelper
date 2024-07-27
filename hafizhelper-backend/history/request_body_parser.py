from typing import OrderedDict

from history.dataclasses import CreateHistoryRequestData
from identities.models import User


def parse_create_read_history_request_data(user: User, request_data: OrderedDict) -> CreateHistoryRequestData:
    return CreateHistoryRequestData(
        surah=request_data.get("surah"),
        verse=request_data.get("verse"),
        surah_number=request_data.get("surah_number"),
        user=user,
    )

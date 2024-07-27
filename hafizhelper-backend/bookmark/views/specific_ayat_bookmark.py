from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from bookmark.serializers import ReadAyatBookmarkResponseSerializer
from bookmark.services.delete_bookmark import DeleteAyatBookmarkService
from bookmark.services.read_bookmark import GetAyatBookmarkService


class AyatBookmarkDetailAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, surah_number: int, ayat: int) -> Response:
        ayat_bookmark = GetAyatBookmarkService.run(user=request.user, surah_number=surah_number, ayat=ayat)

        if ayat_bookmark is None:
            return Response({"error": "AyatBookmark not found"})

        return Response(ReadAyatBookmarkResponseSerializer(ayat_bookmark).data)

    def delete(self, request: Request, surah_number: int, ayat: int) -> Response:

        with transaction.atomic():
            message = DeleteAyatBookmarkService.run(user=request.user, surah_number=surah_number, ayat=ayat)

            return Response({"detail": message})

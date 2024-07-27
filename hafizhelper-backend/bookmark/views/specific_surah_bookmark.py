from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from bookmark.serializers import ReadSurahBookmarkResponseSerializer
from bookmark.services.delete_bookmark import DeleteSurahBookmarkService
from bookmark.services.read_bookmark import GetSurahBookmarkService


class SurahBookmarkDetailAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, surah_number: int) -> Response:
        surah_bookmark = GetSurahBookmarkService.run(user=request.user, surah_number=surah_number)

        if surah_bookmark is None:
            return Response({"error": "SurahBookmark not found"})

        return Response(ReadSurahBookmarkResponseSerializer(surah_bookmark).data)

    def delete(self, request: Request, surah_number: int) -> Response:

        with transaction.atomic():
            message = DeleteSurahBookmarkService.run(user=request.user, surah_number=surah_number)

            return Response({"detail": message})

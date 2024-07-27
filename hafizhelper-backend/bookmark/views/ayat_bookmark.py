from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from bookmark.request_body_parser import parse_create_ayat_bookmark_request_data
from bookmark.serializers import (
    ListReadingAyatBookmarkResponse,
    ReadAyatBookmarkRequestSerializer,
    ReadAyatBookmarkResponseSerializer,
)
from bookmark.services.create_bookmark import CreateAyatBookmarkService
from bookmark.services.list_bookmark import ListAyatBookmarkService


class AyatBookmarkAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request) -> Response:
        list_reading_history = ListAyatBookmarkService.run(user=request.user)

        return Response(ListReadingAyatBookmarkResponse(list_reading_history.dict()).data)

    def post(self, request: Request) -> Response:
        serializer = ReadAyatBookmarkRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            response_data = CreateAyatBookmarkService.run(
                request_data=parse_create_ayat_bookmark_request_data(
                    user=request.user, request_data=serializer.validated_data
                )
            )

            return Response(ReadAyatBookmarkResponseSerializer(response_data).data)

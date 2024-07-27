from django.db import transaction
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from history.request_body_parser import parse_create_read_history_request_data
from history.serializers import ListReadingHistoryResponse, ReadHistoryRequestSerializer, ReadHistoryResponseSerializer
from history.services.create_history import CreateReadHistoryService
from history.services.delete_history import DeleteReadHistoryService
from history.services.list_history import ListHistoryService


class DeleteOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method == "DELETE"


class HistoryAPI(APIView):
    permission_classes = [IsAuthenticated | DeleteOnly]

    def get(self, request: Request) -> Response:
        list_reading_history = ListHistoryService.run(user=request.user)

        return Response(ListReadingHistoryResponse(list_reading_history.dict()).data)

    def post(self, request: Request) -> Response:
        serializer = ReadHistoryRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            response_data = CreateReadHistoryService.run(
                request_data=parse_create_read_history_request_data(
                    user=request.user, request_data=serializer.validated_data
                )
            )

            return Response(ReadHistoryResponseSerializer(response_data).data)

    def delete(self, request: Request) -> Response:
        with transaction.atomic():
            DeleteReadHistoryService.run()

            return Response(data=None, status=status.HTTP_204_NO_CONTENT)

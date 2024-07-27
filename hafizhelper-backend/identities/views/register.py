from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from identities.request_body_parser import parse_register_user_request_data
from identities.serializers import AuthResponseSerializer, RegisterRequestSerializer
from identities.services.registration import RegistrationService


class RegisterAPI(APIView):
    permission_classes = (AllowAny,)

    def post(self, request: Request, **kwargs) -> Response:
        serializer = RegisterRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            parsed_request_data = parse_register_user_request_data(request_data=serializer.validated_data)

            user_register_data = RegistrationService.run(request_data=parsed_request_data)

            return Response(AuthResponseSerializer(user_register_data).data)

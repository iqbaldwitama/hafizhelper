from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from identities.serializers import AuthResponseSerializer, LoginRequestSerializer
from identities.services.login import LoginService


class LoginAPI(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request: Request, **kwargs) -> Response:
        serializer = LoginRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            user_login_data = LoginService.run(**serializer.validated_data)

            return Response(AuthResponseSerializer(user_login_data).data)

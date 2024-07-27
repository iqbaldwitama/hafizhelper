from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from commons.serializers import ReadOnlySerializer
from helloworld.request_body_parser import parse_create_hello_world_request_data
from helloworld.services.create_helloworld import CreateHelloWorldService
from helloworld.services.list_helloworld import ListHelloWorldService


class HelloWorldAPI(APIView):
    permission_classes = (AllowAny,)

    class ListCompanyResponse(ReadOnlySerializer):
        class ListHelloWorldSerializer(ReadOnlySerializer):
            id = serializers.UUIDField()
            message = serializers.CharField()
            created_at = serializers.DateTimeField()
            updated_at = serializers.DateTimeField()

        data = serializers.ListSerializer(child=ListHelloWorldSerializer(), default=list)

    def get(self, request: Request) -> Response:
        list_hello_world = ListHelloWorldService.run()
        return Response(self.ListCompanyResponse(list_hello_world.dict()).data)

    class CreateHelloWorldRequestSerializer(ReadOnlySerializer):
        message = serializers.CharField()

    class CreateCompanyResponse(ReadOnlySerializer):
        id = serializers.UUIDField()
        message = serializers.CharField()
        created_at = serializers.DateTimeField()

    def post(self, request: Request) -> Response:
        serializer = self.CreateHelloWorldRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response_data = CreateHelloWorldService.run(
            request_data=parse_create_hello_world_request_data(serializer.validated_data)
        )
        return Response(self.CreateCompanyResponse(response_data).data)

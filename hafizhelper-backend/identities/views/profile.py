from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from identities.dataclasses import UserProfileDataClass
from identities.models import User
from identities.serializers import ProfileResponseSerializer, UpdateProfileRequest, UpdateProfileResponse
from identities.services.update_profile import UpdateProfileService


class ProfileAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, **kwargs) -> Response:
        user: User = request.user

        full_profile = UserProfileDataClass(
            id=user.id, full_name=user.full_name, email=user.email, profile_photo_path=user.profile_photo_path
        )

        return Response(ProfileResponseSerializer(full_profile).data)

    def patch(self, request: Request, **kwargs) -> Response:
        user: User = request.user

        serializer = UpdateProfileRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            response_data = UpdateProfileService.run(user=user, **serializer.validated_data)

            return Response(UpdateProfileResponse(response_data).data)

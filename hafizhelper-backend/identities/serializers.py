from rest_framework import serializers

from commons.serializers import ReadOnlySerializer


class LoginRequestSerializer(ReadOnlySerializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserAuthData(ReadOnlySerializer):
    id = serializers.CharField()
    full_name = serializers.CharField()
    email = serializers.CharField()


class AuthResponseSerializer(ReadOnlySerializer):
    user = UserAuthData()
    token = serializers.CharField()


class ProfileResponseSerializer(UserAuthData):
    pass


class UpdateProfileRequest(ReadOnlySerializer):
    full_name = serializers.CharField(allow_null=True, allow_blank=True, required=False)


class UpdateProfileResponse(ReadOnlySerializer):
    full_name = serializers.CharField(allow_null=True, allow_blank=True)


class RegisterRequestSerializer(LoginRequestSerializer):
    full_name = serializers.CharField()

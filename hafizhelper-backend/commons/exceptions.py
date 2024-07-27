from typing import Dict, List, Optional, Union

from django.utils.functional import Promise
from rest_framework import status
from rest_framework.exceptions import APIException

from .dataclasses import BaseDataClass


class ApiErrorData(BaseDataClass):
    detail: Union[str, Promise]
    code: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True


class GeneralException(Exception):
    def __init__(self, message: str = "Something went wrong.", code: Optional[str] = None):
        self.message = message
        self.code = code


class ValidationErrorException(GeneralException):
    def __init__(
        self,
        message: str = "Invalid data.",
        code: Optional[str] = None,
        field_errors: Optional[Dict[str, List[str]]] = None,
    ):
        super().__init__(message=message, code=code)

        self.field_errors = field_errors or {}


class ExtendedAPIException(APIException):
    def __init__(self, detail=None, code=None):
        if isinstance(detail, ApiErrorData):
            super().__init__(detail=detail.detail, code=detail.code)
            return
        super().__init__(detail, code)


class BadRequestException(ExtendedAPIException):
    status_code = status.HTTP_400_BAD_REQUEST


class FirebaseError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

from django.urls import path  # noqa

from identities.views.login import LoginAPI
from identities.views.profile import ProfileAPI
from identities.views.register import RegisterAPI

identities_urls = [
    path("login/", LoginAPI.as_view(), name="user-login-api"),
    path("profile/", ProfileAPI.as_view(), name="user-profile-api"),
    path("register/", RegisterAPI.as_view(), name="user-register-api"),
]

urlpatterns = []
urlpatterns += identities_urls

from django.urls import path

from helloworld.views.helloworld import HelloWorldAPI

helloworld_urls = [
    path("hello-world/", HelloWorldAPI.as_view(), name="list-hello-world"),
]

urlpatterns = []
urlpatterns += helloworld_urls

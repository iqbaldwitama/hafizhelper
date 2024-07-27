from django.urls import path  # noqa

from history.views.history import HistoryAPI

history_urls = [
    path("", HistoryAPI.as_view(), name="history-api"),
]

urlpatterns = []
urlpatterns += history_urls

import factory
from django.utils import timezone

from bookmark.models import AyatBookmark, SurahBookmark


class SurahBookmarkFactory(factory.django.DjangoModelFactory):
    surah = factory.Sequence(lambda n: f"Surah {n}")
    surah_number = factory.Sequence(lambda n: f"Surah Number {n}")
    created_at = timezone.now()

    class Meta:
        model = SurahBookmark


class AyatBookmarkFactory(factory.django.DjangoModelFactory):
    surah = factory.Sequence(lambda n: f"Surah {n}")
    ayat = factory.Sequence(lambda n: f"ayat {n}")
    surah_number = factory.Sequence(lambda n: f"Surah Number {n}")
    created_at = timezone.now()

    class Meta:
        model = AyatBookmark

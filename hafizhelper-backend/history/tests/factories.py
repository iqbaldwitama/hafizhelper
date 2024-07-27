import factory
from django.utils import timezone

from history.models import ReadHistory


class ReadHistoryFactory(factory.django.DjangoModelFactory):
    surah = factory.Sequence(lambda n: f"Surah {n}")
    verse = factory.Sequence(lambda n: f"Verse {n}")
    surah_number = factory.Sequence(lambda n: f"Surah Number {n}")
    created_at = timezone.now()

    class Meta:
        model = ReadHistory

from rest_framework import serializers

from commons.serializers import ReadOnlySerializer


class ListAyatBookmarkSerializer(ReadOnlySerializer):
    id = serializers.UUIDField()
    surah = serializers.CharField()
    ayat = serializers.IntegerField()
    surah_number = serializers.IntegerField()
    created_at = serializers.DateTimeField()


class ListReadingAyatBookmarkResponse(ReadOnlySerializer):
    data = serializers.ListSerializer(child=ListAyatBookmarkSerializer(), default=list)


class ReadAyatBookmarkRequestSerializer(ReadOnlySerializer):
    surah = serializers.CharField(required=True)
    ayat = serializers.IntegerField(required=True)
    surah_number = serializers.IntegerField(required=True)


class ReadAyatBookmarkResponseSerializer(ReadOnlySerializer):
    id = serializers.UUIDField(required=True)
    surah = serializers.CharField(required=True)
    ayat = serializers.IntegerField(required=True)
    surah_number = serializers.IntegerField(required=True)
    created_at = serializers.DateTimeField(required=True)


class ListSurahBookmarkSerializer(ReadOnlySerializer):
    id = serializers.UUIDField()
    surah = serializers.CharField()
    surah_number = serializers.IntegerField()
    created_at = serializers.DateTimeField()


class ListReadingSurahBookmarkResponse(ReadOnlySerializer):
    data = serializers.ListSerializer(child=ListSurahBookmarkSerializer(), default=list)


class ReadSurahBookmarkRequestSerializer(ReadOnlySerializer):
    surah = serializers.CharField(required=True)
    surah_number = serializers.IntegerField(required=True)


class ReadSurahBookmarkResponseSerializer(ReadOnlySerializer):
    id = serializers.UUIDField(required=True)
    surah = serializers.CharField(required=True)
    surah_number = serializers.IntegerField(required=True)
    created_at = serializers.DateTimeField(required=True)

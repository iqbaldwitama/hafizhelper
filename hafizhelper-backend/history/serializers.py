from rest_framework import serializers

from commons.serializers import ReadOnlySerializer


class ListHistorySerializer(ReadOnlySerializer):
    id = serializers.UUIDField()
    surah = serializers.CharField()
    verse = serializers.IntegerField()
    surah_number = serializers.IntegerField()
    created_at = serializers.DateTimeField()


class ListReadingHistoryResponse(ReadOnlySerializer):
    data = serializers.ListSerializer(child=ListHistorySerializer(), default=list)


class ReadHistoryRequestSerializer(ReadOnlySerializer):
    surah = serializers.CharField(required=True)
    verse = serializers.IntegerField(required=True)
    surah_number = serializers.IntegerField(required=True)


class ReadHistoryResponseSerializer(ReadOnlySerializer):
    id = serializers.UUIDField(required=True)
    surah = serializers.CharField(required=True)
    verse = serializers.IntegerField(required=True)
    surah_number = serializers.IntegerField(required=True)
    created_at = serializers.DateTimeField(required=True)

from rest_framework import serializers
from .models import ShortURL

class ShortURLSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()

    class Meta:
        model = ShortURL
        fields = (
            'id',
            'original_url',
            'short_code',
            'created_at',
            'updated_at',
            'active',
            'click_count',
            'owner',
            'short_url',
        )
        read_only_fields = (
            'owner',
            'short_code',
            'click_count',
            'created_at',
            'updated_at',
            'short_url',
        )

    def get_short_url(self, obj):
        return obj.get_short_url()
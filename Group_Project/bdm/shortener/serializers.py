from rest_framework import serializers
from .models import ShortURL, Category

class CategoryURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ShortURLSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()

    category  = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = ShortURL
        fields = (
            'id',
            'original_url',
            'short_code',
            'category',
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
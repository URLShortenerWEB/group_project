
from django.conf import settings
from django.db import models

class ShortURL(models.Model):
    owner        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='short_urls')
    original_url = models.URLField()
    short_code   = models.CharField(max_length=10, unique=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)
    active       = models.BooleanField(default=True)
    click_count  = models.PositiveIntegerField(default=0)

    def get_short_url(self):
        domain = getattr(settings, 'BDM_BASE_URL', 'http://127.0.0.1:8000')
        return f"{domain}/{self.short_code}"

class ClickEvent(models.Model):
    short_url  = models.ForeignKey(ShortURL, on_delete=models.CASCADE, related_name='click_events')
    timestamp  = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)


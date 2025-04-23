from django.shortcuts import render
import string
import random

from django.db.models import F

from django.shortcuts import redirect
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import ShortURL, ClickEvent
from .serializers import ShortURLSerializer

# Create your views here.

def generate_short_code(length: int = 6) -> str:
    chars = string.ascii_letters + string.digits
    while True:
        code = ''.join(random.choices(chars, k=length))
        if not ShortURL.objects.filter(short_code=code).exists():
            return code

class ShortURLListByOwnerAPIView(generics.ListAPIView):

    serializer_class   = ShortURLSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner_id = self.kwargs.get('owner_id')
        return ShortURL.objects.filter(owner_id=owner_id)

class ShortURLCreateAPIView(generics.CreateAPIView):

    serializer_class = ShortURLSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        code = generate_short_code()
        serializer.save(owner=self.request.user, short_code=code)


class ShortURLRedirectAPIView(generics.GenericAPIView):
    queryset = ShortURL.objects.filter(active=True)
    lookup_field = 'short_code'
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        short_url = self.get_object()

        short_url.click_count = F('click_count') + 1
        short_url.save(update_fields=['click_count'])
        short_url.refresh_from_db(fields=['click_count'])


        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        ClickEvent.objects.create(
            short_url=short_url,
            ip_address=ip,
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:255]
        )

        return redirect(short_url.original_url)

class ShortURLRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    #get patch delete
    serializer_class = ShortURLSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShortURL.objects.filter(owner=self.request.user)
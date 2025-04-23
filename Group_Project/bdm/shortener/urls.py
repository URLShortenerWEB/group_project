from django.urls import path
from .views import ShortURLCreateAPIView, ShortURLListByOwnerAPIView, ShortURLRetrieveUpdateDestroyAPIView

app_name = 'shortener'
urlpatterns = [
    path('', ShortURLCreateAPIView.as_view(), name='create'),
    path('<int:pk>/', ShortURLRetrieveUpdateDestroyAPIView.as_view(), name='detail'),
    path('owner/<int:owner_id>/', ShortURLListByOwnerAPIView.as_view(), name='list-by-owner'),
]
from django.urls import path
from .views import ShortURLCreateAPIView, ShortURLListByOwnerAPIView, ShortURLRetrieveUpdateDestroyAPIView, CategoryListView, CategoryRetrieveView

app_name = 'shortener'
urlpatterns = [
    path('', ShortURLCreateAPIView.as_view(), name='create'),
    path('<int:pk>/', ShortURLRetrieveUpdateDestroyAPIView.as_view(), name='detail'),
    path('owner/<int:owner_id>/', ShortURLListByOwnerAPIView.as_view(), name='list-by-owner'),

    path('category/', CategoryListView.as_view(), name='categories'),
    path('category/<int:pk>/', CategoryRetrieveView.as_view(), name='category-detail'),
]
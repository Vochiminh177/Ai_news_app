from django.urls import path
from .views import ArticleDetailView, ArticleListCreateView

urlpatterns = [
    path('posts/', ArticleListCreateView.as_view(), name='article-list'),
    path('posts/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
]
from django.urls import path
from .views import article_list, article_detail, article_category, search_article, category_detail
app_name = "news"
urlpatterns = [
    path('articles/',article_list, name='article-list'),
    path('articles/<int:pk>/', article_detail, name='article-detail'),
    path("articles/category", article_category, name="article-category"),
    path('articles/search/', search_article, name="article-search"),
    path("categories/", category_detail, name="category-detail")
]
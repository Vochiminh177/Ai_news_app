from django.urls import path
from .views import *
app_name = "news"
urlpatterns = [
    path('articles/',article_list, name='article-list'),
    path('articles/<int:pk>/', article_detail, name='article-detail'),
    path('articles/user/<int:userID>', article_user, name='article-user'),
    path("articles/category", article_category, name="article-category"),
    path('articles/search/', search_article, name="article-search"),
    path("categories/", category_detail, name="category-detail"),
    path("all_categories/",get_all_category,name="category"),
    path("update_status/<int:pk>/",update_status_article,name="update-status"),
    path("articles/advanced_search/",advanced_search_article,name ="advanced-search" ),
    path("articles/stats/",stats_article,name="stat-article"),
    path("articles/add_view/<int:pk>/",add_view_article_detail,name="add-view-articles"),
    path("comment/<int:pk>/",comment,name = "get-comment")
]

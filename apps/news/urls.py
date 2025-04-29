from django.urls import path
from .views import article_list, article_detail, article_category, search_article, category_detail,get_all_category,update_status_article,advanced_search_article,stats_article,add_view_article_detail
app_name = "news"
urlpatterns = [
    path('articles/',article_list, name='article-list'),
    path('articles/<int:pk>/', article_detail, name='article-detail'),
    path("articles/category", article_category, name="article-category"),
    path('articles/search/', search_article, name="article-search"),
    path("categories/", category_detail, name="category-detail"),
    path("all_categories/",get_all_category,name="category"),
    path("update_status/<int:pk>/",update_status_article,name="update-status"),
    path("articles/advanced_search/",advanced_search_article,name ="advanced-search" ),
    path("articles/stats/",stats_article,name="stat-article"),
    path("articles/add_view/<int:pk>/",add_view_article_detail,name="add-view-articles")
]
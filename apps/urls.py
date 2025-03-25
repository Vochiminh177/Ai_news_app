from django.urls import path, include
from .users.views import  LoginView, LogoutView,SigninView

urlpatterns = [
    path('signin/', SigninView.as_view(), name='signin'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("v1/", include("apps.news.urls"))
]
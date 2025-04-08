from django.urls import path, include
<<<<<<< HEAD
from .users.views import  LoginView, LogoutView,RegisterView

=======
from .users.views import  LoginView, LogoutView,SigninView
from .views import get_login ,get_signin,get_home,get_admin
>>>>>>> feat/post
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("v1/", include("apps.news.urls")),
    path('login_page',get_login,name='login_page'),
    path('signin_page',get_signin,name='signin_page'),
    path('home',get_home,name='home'),
    path('admin',get_admin,name='admin')
    ]
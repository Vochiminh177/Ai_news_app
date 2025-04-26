from django.urls import path, include
from .users.views import  *
from .views import get_login ,get_signin,get_home,get_admin
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/',GetAllUsers.as_view(),name='user-list'),
    path('users/search/',UserSearchView.as_view(), name='user-search'),
    path('user/<int:user_id>/',UserDetailView.as_view(), name='user-detail'),
    path('user/edit/<int:user_id>/',EditUserView.as_view(),name="user-edit"),
    path('user/status/<int:user_id>/',EditStatusUserView.as_view(),name="edit-status"),
    path('role/',GetAllRole.as_view(),name="role-list"),
    path('role/<int:role_id>/',GetRoleAPIView.as_view(),name="role-detail"),
    path('role/edit/<int:role_id>/',RoleEditAPIView.as_view(),name="role-edit"),
    path('role/create/',RoleCreateAPIView.as_view(),name="role-create"),
    path('permission/',GetAllPermission.as_view(),name="permission-list"),
    path("v1/", include("apps.news.urls"))
]


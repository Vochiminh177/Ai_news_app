from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Role(models.Model):
    role_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.role_name
class UserModel(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.CharField(max_length=255,blank=True,null=True)
    created_at =models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user_status = models.IntegerField(default=1)
    roles =models.ManyToManyField(Role ,through='UserRole')
    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username']
    def get_role(self):
        roles = [user_role.role.role_name for user_role in self.user_roles.all()]
        return roles if roles else ["user"]
    def __str__(self):
        return self.username

class UserRole(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE ,related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE ,related_name='role_users')

    class Meta:
        unique_together = ('user', 'role')

    def __str__(self):
        return f"{self.user.username} - {self.role.role_name}"

class Permission(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PermissionRole(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE , related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permission_roles')

    class Meta:
        constraints = [
        models.UniqueConstraint(fields=['role', 'permission'], name='unique_role_permission')
        ]

    def __str__(self):
        return f"{self.role.role_name} - {self.permission.name}"

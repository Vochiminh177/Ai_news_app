<<<<<<< HEAD
from django.db import models

# Create your models here.
=======
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class UserModel(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.CharField(max_length=255,blank=True,null=True)
    created_at =models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user_status = models.IntegerField(default=1)
    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username']
    def get_role(self):
        user_role = self.user_roles.first()
        return user_role.role.role_name if user_role else "user"
    def __str__(self):
        return self.username

>>>>>>> e02ec155c905935574bc80b059debf46e82bef66

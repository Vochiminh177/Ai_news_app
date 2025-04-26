from django.db import models
from ..users.models import UserModel
class Category(models.Model):
    category_name =models.CharField(max_length=255,unique=True)
    created_at= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name
    
class Article(models.Model):
    STATUS_CHOICES = [
        ('draft','Draft'),
        ('published','Published'),
        ('rejected','Rejected'),
    ]
    title =models.CharField(max_length=255)
    description = models.TextField(blank=True , null=True)
    img= models.ImageField(upload_to="thumbnails/", null=False, blank=False, default='default.jpg')
    content = models.TextField()
    created_at =models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10,choices=STATUS_CHOICES,default='draft')
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)
    def get_like_count(self):
        return self.likes.count()
    def __str__(self):
        return self.title


    
class Comment(models.Model):
    content =models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)
    article = models.ForeignKey(Article,on_delete = models.CASCADE,related_name='comments')
    user = models.ForeignKey(UserModel,on_delete=models.CASCADE ,related_name='comments')

    def __str__(self):
        return f"{self.user.username} -{self.article.title}"
    
class Like(models.Model):
    user = models.ForeignKey(UserModel,on_delete=models.CASCADE ,related_name='likes')
    article = models.ForeignKey(Article,on_delete=models.CASCADE , related_name='likes')
    class Meta:
        unique_together = ('user','article')
    def __str__(self):
        return f"{self.user.username} likes {self.article.title}"
    
<<<<<<< HEAD
=======
class Role(models.Model):
    role_id =models.CharField(max_length=255)
    role_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        # constraints = [
        #     models.UniqueConstraint(fields=['user', 'role'], name='unique_user_role')
        # ]
        pass
    def __str__(self):
        return self.role_name


class Permission(models.Model):
    per_id =models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
>>>>>>> feat/post

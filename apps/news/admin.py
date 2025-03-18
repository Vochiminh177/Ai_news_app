from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(Category)
admin.site.register(Role)
admin.site.register(Permission)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Article)
admin.site.register(UserRole)
admin.site.register(PermissionRole)
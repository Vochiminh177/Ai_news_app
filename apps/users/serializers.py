from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = UserModel
        fields = ['id','username','email','avatar','created_at','updated_at','roles','user_status']
    
    def get_roles(self, obj):
        return [user_role.role.role_name for user_role in obj.user_roles.all()]
    def get_avatar(self, obj):
        if obj.avatar:
            request = self.context.get('request', None)
            url = obj.avatar.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()
    class Meta:
        model = Role
        fields = ['id','role_name','created_at','updated_at','permissions']

    def get_permissions(self,obj):
        permissions = obj.role_permissions.all().values_list('permission',flat =True)
        queryset = Permission.objects.filter(id__in=permissions)
        return PermissionSerializer(queryset, many=True).data

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name']

class CreateRoleSerializer(serializers.ModelSerializer):
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    class Meta:
        model = Role
        fields = ['id', 'role_name', 'permission_ids']

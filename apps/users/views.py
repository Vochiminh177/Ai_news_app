from django.shortcuts import render
from django.contrib.auth import login,logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import *
from django.db.models import Q
from django.contrib.auth import get_user_model
# Create your views here.
UserModel = get_user_model()

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"error": "Vui lòng không để trống"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserModel.objects.get(email=email)
            
            if not user.check_password(password):  
                return Response({"error": "Mật khẩu không chính xác"}, status=status.HTTP_400_BAD_REQUEST)

            login(request, user)  

            return Response({
                "message": "Đăng nhập thành công!",
                "user_id": user.id,
                "email": user.email,
                "role": user.get_role()  
            }, status=status.HTTP_200_OK)

        except UserModel.DoesNotExist:
            return Response({"error": "Email không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Đăng xuất thành công"}, status=status.HTTP_200_OK)
    


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "")
        password2 = request.data.get("password2", "")

        if not username or not email or not password or not password2:
            return Response({"error": "Vui lòng điền đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

        if password != password2:
            return Response({"error": "Mật khẩu không khớp!"}, status=status.HTTP_400_BAD_REQUEST)

        if UserModel.objects.filter(email=email).exists():
            return Response({"error": "Email đã được sử dụng!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Email không hợp lệ!"}, status=status.HTTP_400_BAD_REQUEST)

        
        user = UserModel.objects.create_user(username=username, email=email, password=password)
        default_role = Role.objects.get(role_name="user")
        UserRole.objects.create(user=user , role=default_role)
        return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)

class GetAllUsers(APIView):
    def get(self,request):
        users = UserModel.objects.all()
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data , status=status.HTTP_200_OK)

class UserSearchView(APIView):
    def get(self,request):
        search = request.query_params.get('search',None)
        
        if search:
            users=UserModel.objects.filter(
                Q(username__icontains=search) | Q(email__icontains=search)
            ).distinct()
            serializer = UserSerializer(users,many= True ,context={'request': request})
            return Response(serializer.data)
        
        users = UserModel.objects.all()
        serializer = UserSerializer(users, many=True,context={'request': request})
        return Response(serializer.data)
    
class UserDetailView(APIView):
    def get(self,request,user_id):
        try:
            user = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return Response({"message":"Người dùng không tồn tại "},status=status.HTTP_404_NOT_FOUND)
        
        serializer =UserSerializer(user ,context={'request': request})
        return Response(serializer.data,status=status.HTTP_200_OK)
       
class EditUserView(APIView):
    def put(self,request,user_id):
        try:
            user = UserModel.objects.get(id=user_id)
            UserRole.objects.filter(user=user).delete()
            list_role =request.data.getlist('role')
            for r_id in list_role:
                UserRole.objects.create(user = user ,role_id=r_id)

            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            avatar = request.FILES.get('avatar')
            if avatar:
                user.avatar =avatar
            user.save()
            serialized_user = UserSerializer(user,context={"request": request})
            return Response(serialized_user.data, status=status.HTTP_200_OK)
        except UserModel.DoesNotExist:
            return Response({"error":"User không tồn tại ."},status=status.HTTP_404_NOT_FOUND)
        
class EditStatusUserView(APIView):
    def put(self,request,user_id):
        try: 
            user =UserModel.objects.get(id=user_id)
            user_status= request.data.get('user_status')
            if user_status not in [0,1]:
                return Response({"error":"Trạng thái không hợp lệ"},status=status.HTTP_400_BAD_REQUEST)
            user.user_status = user_status
            user.save()
            return Response({"message":"Đã cập nhật trạng thái "},status=status.HTTP_200_OK)
        except UserModel.DoesNotExist:
            return Response({"error":"Người dùng không tồn tại"},status=status.HTTP_404_NOT_FOUND)

class GetAllRole(APIView):
    def get(self,request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles , many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)
    
class GetRoleAPIView(APIView):
    def get(self,request,role_id):
        try:
            role = Role.objects.get(id=role_id)
            serializers =RoleSerializer(role)
            return Response(serializers.data,status=status.HTTP_200_OK)
        except Role.DoesNotExist:
            return Response({"error":"Vai trò không tồn tại "},status=status.HTTP_404_NOT_FOUND)

class RoleCreateAPIView(APIView):
    def post(self,request):
        serializers = CreateRoleSerializer(data=request.data)
        if serializers.is_valid():
            role = Role.objects.create(role_name=serializers.validated_data['role_name'])
            permission_ids = serializers.validated_data['permission_ids']

            for pid in permission_ids:
                PermissionRole.objects.create(role=role,permission_id=pid)

            role = Role.objects.get(id=role.id)
            response_data = RoleSerializer(role).data
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class RoleEditAPIView(APIView):
    def put(self,request , role_id):
        try:
            role = Role.objects.get(id= role_id)
        except Role.DoesNotExist:
            return Response({"error":"Không tìm thấy mã "},status=status.HTTP_404_NOT_FOUND)
    
        roleName = request.data.get('role_name')
        permission_ids = request.data.get('permission_ids',[])

        if not roleName:
                return Response({"error":"Vai trò không được để trống"},status=status.HTTP_400_BAD_REQUEST)
        
        role.role_name = roleName
        role.save()

        PermissionRole.objects.filter(role=role).delete()
        for perm_id in permission_ids:
            PermissionRole.objects.create(role=role,permission_id = perm_id)

        serializer =RoleSerializer(role)
        return Response(serializer.data , status=status.HTTP_200_OK)
         
class GetAllPermission(APIView):
    def get(self,request):
        permissions = Permission.objects.all()
        serializer = PermissionSerializer(permissions,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


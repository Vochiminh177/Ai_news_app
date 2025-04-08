from django.shortcuts import render
from django.contrib.auth import login,logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny

from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import *
# Create your views here.
UserModel = get_user_model()

class LoginView(APIView):
    def post(self, request):
        #step 1:lấy dữ liêu
        print("Dữ liệu nhận được:", request.data)
        email = request.data.get('email')
        password = request.data.get('password')
        #step 2 : Kiểm tra nhập liệu 
        if not email or not password:
            return Response({"error": "Vui lòng không để trống"}, status=status.HTTP_400_BAD_REQUEST)
        #step 3 : Kiểm tra đăng nhập 
        try:
            user = UserModel.objects.get(email=email)
            
            if not user.check_password(password):  
                return Response({"error": "Mật khẩu không chính xác"}, status=status.HTTP_400_BAD_REQUEST)
            print("User authenticate:", user)
            login(request, user)  
            #step 4: trả về response
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
    


class SigninView(APIView):
    def post(self, request):
        authentication_classes = [SessionAuthentication, BasicAuthentication]  # Có thể bỏ trống []
        permission_classes = [AllowAny]  # Cho phép mọi request, không cần xác thực
        #step 1; lấy dữ liệu 
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "")
        password2 = request.data.get("password2", "")
        #step 2: kiểm tra nhập liệu
        if not username or not email or not password or not password2:
            return Response({"error": "Vui lòng điền đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)
        #step 3: kiểm tra dữ liệu hệ thống 
        if password != password2:
            return Response({"error": "Mật khẩu không khớp!"}, status=status.HTTP_400_BAD_REQUEST)

        if UserModel.objects.filter(email=email).exists():
            return Response({"error": "Email đã được sử dụng!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Email không hợp lệ!"}, status=status.HTTP_400_BAD_REQUEST)

        #step 4: khởi tạo user
        user = UserModel.objects.create_user(username=username, email=email, password=password)
        #step 5: tự động tạo quyền user trong bảng UserRole
        role_id=Role.objects.get(role_name='user')
        user.roles.add(role_id)

        return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)

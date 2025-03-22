from django.shortcuts import render

def get_login(request):
    return render(request,"login.html")

def get_signin(request):
    return render(request,"signin.html")

def get_home(request):
    return render(request,"home.html")

def get_admin(request):
    return render(request,"admin.html")
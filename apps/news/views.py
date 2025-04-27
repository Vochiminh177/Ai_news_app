from django.shortcuts import render
from .models import Article,Category
from .serializer import ArticleSerializer, CategorySerializer
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser


# Create your views here.
@api_view(["GET", "POST"])
@parser_classes([MultiPartParser, FormParser])
def article_list (req):
    if req.method == "GET":
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    if req.method == "POST":
        serializer = ArticleSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)

@api_view(["GET", "PUT", "DELETE"])
def article_detail(req, pk):
    try:
        article = Article.objects.get(id=pk)
    except Article.DoesNotExist:
        return Response({"error": "Not Found Article"}, status=status.HTTP_404_NOT_FOUND)
    
    if req.method == "GET":
        serializer = ArticleSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)
    if req.method == "PUT":
        serializer = ArticleSerializer(article, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if req.method == "DELETE":
        article.delete()
        return Response({"message": "delete article success"}, status=status.HTTP_200_OK)

@api_view(["GET"])
def article_category(req):
    if req.method == "GET":
        category = req.data.get("category")
        articles = Article.objects.filter(category=category)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def search_article(req):
    if req.method == "GET":
        key_search = req.GET.get("key", "")
        print(key_search)
        articles = Article.objects.filter(Q(title__icontains = key_search)| Q(content__icontains=key_search))
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def article_user(req):
    if req.method == "GET":
        user_id = req.GET.get("user_id", "")
        articles = Article.objects.filter(user_id=user_id)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    pass


@api_view(["GET"])
def article_status(req):
    if req.mehtod == "GET":
        status_article = req.GET.get("status", "draft")
        articles = Article.objects.filter(status=status_article)
        serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"]) 
def category_detail(req):
    if req.method == "POST":
        serializer = CategorySerializer(data = req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)
    
#Lấy all thể loại cho combobox (hào)
@api_view(["GET"])
def get_all_category(req):
    if req.method == "GET":
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PUT"])
def update_status_article(req,pk):
    if req.method == "PUT":
        try: 
            article = Article.objects.get(id=pk)
        except Article.DoesNotExist:
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)
        status_a = req.data.get('status')
        if status_a not in dict(Article.STATUS_CHOICES).keys():
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        article.status = status_a
        article.save()
        return Response({'status':article.status},status=status.HTTP_200_OK)

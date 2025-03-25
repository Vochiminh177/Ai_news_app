from django.shortcuts import render
from .models import Article
from .serializer import ArticleSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q


# Create your views here.
@api_view(["GET", "POST"])
def article_list (req):
    if req.method == "GET":
        articles = Article.objects.all()
        print(articles)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    if req.method == "POST":
        serializer = ArticleSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
def article_detail(req, pk):
    try:
        article = Article.objects.get(pk=pk)
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
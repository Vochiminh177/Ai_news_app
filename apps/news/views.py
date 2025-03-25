from django.shortcuts import render
from rest_framework import generics
from .models import Article
from .serializer import ArticleSerializer

# Create your views here.

class ArticleListCreateView (generics.CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleDetailView (generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

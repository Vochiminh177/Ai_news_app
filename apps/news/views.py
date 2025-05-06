from django.shortcuts import render
from .models import Article,Category,Comment,Like,UserModel
from .serializer import ArticleSerializer, CategorySerializer,CommentSerializer
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models.functions import ExtractMonth, ExtractQuarter
from django.db.models import Count

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
        article = Article.objects.select_related('user_id').get(id=pk)
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
        category = req.query_params.get("category")
        articles = Article.objects.filter(category=category)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def search_article(req):
    if req.method == "GET":
        key_search = req.GET.get("key", "")
        articles = Article.objects.filter(Q(title__icontains = key_search)| Q(content__icontains=key_search))
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def article_user(req, userID):
    if req.method == "GET":
        articles = Article.objects.filter(user_id=userID)
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

#Đổi trạng thái 
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
    
# Tìm kiếm nâng cao
@api_view(["GET"])
def advanced_search_article(req):
    if req.method == "GET":
        key_search = req.GET.get("key", "")
        status_filter = req.GET.get("status","")
        category_id = req.GET.get("category","")
        from_date = req.GET.get("from_date","")
        to_date = req.GET.get("to_date","")
        sort = req.GET.get('sort',"")
        articles = Article.objects.all()
        if key_search:
            articles = articles.filter(
                Q(title__icontains = key_search)| Q(content__icontains=key_search ) |Q(description__icontains=key_search )
            )     
        if status_filter:
            articles = articles.filter(status = status_filter ) 
        if category_id:
            articles = articles.filter(category = category_id)
        
        if from_date:
            articles = articles.filter(created_at__gte=from_date)
        if to_date:
            articles = articles.filter(created_at__lte=to_date)
        
        if sort == "new":
            articles= articles.order_by("created_at")
        serializer = ArticleSerializer(articles,many = True)
        return Response(serializer.data , status=status.HTTP_200_OK)
        
@api_view(["GET"])
def stats_article(req):
    if req.method == "GET":
        mode = req.GET.get('mode', 'month')  
        year = req.GET.get('year', '2025')

        articles = Article.objects.all()

    # Nếu có năm thì lọc theo năm
        if year:
            articles = articles.filter(created_at__year=year)

        if mode == 'month':
            stats = articles.annotate(
                month=ExtractMonth('created_at')
            ).values('month').annotate(
                total=Count('id')
            ).order_by('month')

            data = {f"{item['month']:02d}": item['total'] for item in stats}

        elif mode == 'quarter':
            stats = articles.annotate(
                quarter=ExtractQuarter('created_at')
            ).values('quarter').annotate(
                total=Count('id')
            ).order_by('quarter')

            data = {f"Q{item['quarter']}": item['total'] for item in stats}

        else:
            return Response({"error": "mode phải là 'month' hoặc 'quarter'"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data, status=status.HTTP_200_OK)
    
@api_view(["PUT"])
def add_view_article_detail(req, pk):
    try:
        article = Article.objects.get(id=pk)
    except Article.DoesNotExist:
        return Response({"error": "Không tìm thấy bài viết"}, status=status.HTTP_404_NOT_FOUND)
    
    if req.method == "PUT":
        article.counter_view +=1
        article.save()
        serializer = ArticleSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_like_article(req, pk):
    try:
        like_count = Like.objects.filter(article = pk).count()
        return Response({"like_count":like_count},status=status.HTTP_200_OK)
    except Article.DoesNotExist:
        return Response({"error": "Không tìm thấy bài viết"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def toggle_like(req):
    user_id = req.data.get('user_id')
    article_id = req.data.get('article_id')

    try:
        user = UserModel.objects.get(id=user_id)
        article =Article.objects.get(id = article_id)
    except UserModel.DoesNotExist or Article.DoesNotExist:
        return Response({"error":"Không tìm thấy user hoặc bài viết"},status=status.HTTP_404_NOT_FOUND)
    
    try:
        like = Like.objects.get(user=user, article=article)
        like.delete()
        return Response({"message": "Đã bỏ thích bài viết."}, status=status.HTTP_200_OK)
    except Like.DoesNotExist:
        Like.objects.create(user=user, article=article)
        return Response({"message": "Đã thích bài viết!"}, status=status.HTTP_201_CREATED)
@api_view(['GET'])
def get_like_user(req,pk):
    try:
        list_like = Like.objects.filter(user = pk)
        list_id_article = [like.article.id for like in list_like]
        return Response({"list_like":list_id_article},status=status.HTTP_200_OK)
    except UserModel.DoesNotExist:
         return Response({"error": "Không tìm người dùng"}, status=status.HTTP_404_NOT_FOUND)
        



@api_view(["GET", "PUT"])
def comment(req,pk):
    
    comment = Comment.objects.filter(article = pk)
    if not comment.exists():
        return Response({"error":"Baì viết này không có bình luận"},status=status.HTTP_404_NOT_FOUND)
    if req.method == "GET":
        serializer = CommentSerializer(comment , many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
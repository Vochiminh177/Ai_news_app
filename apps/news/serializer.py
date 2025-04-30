from rest_framework import serializers

from .models import Article, Category ,Comment


class ArticleSerializer (serializers.ModelSerializer):
    img = serializers.ImageField(required=False)
    class Meta:
        model =  Article
        fields = "__all__"


class CategorySerializer (serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class CommentSerializer (serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
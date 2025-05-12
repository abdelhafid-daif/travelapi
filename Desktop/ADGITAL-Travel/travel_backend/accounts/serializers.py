# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile,CustomUser,GroupMessage
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'adresse', 'city', 'phone_number','last_connection']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar', 'bio', 'is_client', 'is_commercial', 'is_support', 'is_manager', 'is_comptable']

class CustomUserSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'city', 'adresse', 'phone_number', 'last_connection', 'is_online','avatar']

    def get_is_online(self, obj):
        if obj.last_connection:
            return timezone.now() - obj.last_connection < timedelta(minutes=5)
        return False
    def get_avatar(self, obj):
        try:
            return obj.profile.avatar.url if obj.profile.avatar else None
        except Profile.DoesNotExist:
            return None

class GroupMessageSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = GroupMessage
        fields = ['id', 'user', 'content', 'timestamp']
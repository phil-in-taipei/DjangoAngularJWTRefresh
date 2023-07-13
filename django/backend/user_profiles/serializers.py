from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from django.contrib.auth import get_user_model
from .models import UserProfile


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',
                  'username')


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = "__all__"


class UserProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('surname', 'given_name', "contact_email")


class UserCreateSerializer(serializers.ModelSerializer):
    profile = serializers.RelatedField(read_only=True)
    re_password = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 're_password', 'profile')

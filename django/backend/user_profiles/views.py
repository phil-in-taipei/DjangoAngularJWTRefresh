from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

from .models import UserProfile
from .serializers import UserProfileSerializer, UserCreateSerializer


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        print('this is calling the get function')
        print(request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    def patch(self, request):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        print('this is calling the patch function')
        print(request.user)
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        # partial=True to patch data partially
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(code=400, data="wrong parameters")


class UserList(generics.ListCreateAPIView):
    model = User
    serializer_class = UserCreateSerializer
    http_method_names = ['post',]

    def create(self, request, *args, **kwargs):
        data = request.data
        if data['password'] == data['re_password']:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=data['username'],
                    password=data['password']
                )
                user.clean()
                user.save()
                UserProfile.objects.create(
                    user=user,
                    surname=data['profile']['surname'],
                    given_name=data['profile']['given_name'],
                    contact_email=data['profile']['contact_email']
                )
            serializer = UserCreateSerializer(user)
            headers = self.get_success_headers(serializer.data)
            return Response(data={"message": "User successfully created!"}, status=status.HTTP_201_CREATED,
                            headers=headers)
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Error creating user!"})

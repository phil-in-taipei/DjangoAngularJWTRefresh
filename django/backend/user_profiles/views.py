from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

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
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True) # set partial=True to update a data partially
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(code=400, data="wrong parameters")
            #return JsonResponse(code=201, data=serializer.data)
        #return JsonResponse(code=400, data="wrong parameters")

from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser,Profile,GroupMessage
from travel.permissions import IsManagerUser
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from rest_framework import viewsets, permissions
from .serializers import ProfileSerializer,CustomUserSerializer,GroupMessageSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet
from travel.permissions import IsManagerUser


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        if CustomUser.objects.filter(username=data['username']).exists():
            return Response({'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=data['email']).exists():
            return Response({'detail': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),
            adresse=data.get('adresse'),
            city=data.get('city'),
            phone_number=data.get('phone_number'),
        )
        profile = user.profile
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return Response({
            'detail': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_client': profile.is_client,
                'is_support': profile.is_support,
                'is_manager': profile.is_manager,
                'is_commercial': profile.is_commercial,
            },
            'token': token['access'],
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    profile = user.profile
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'adresse': user.adresse,
        'city': user.city,
        'phone_number': user.phone_number,
        'profile': {
            'is_client': profile.is_client,
            'is_commercial': profile.is_commercial,
            'is_support': profile.is_support,
            'is_manager': profile.is_manager,
            'is_comptable': profile.is_comptable,
            'avatar': profile.avatar.url if profile.avatar else None,
            'bio': profile.bio,
        }
    })

# views.py


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsManagerUser]

    def partial_update(self, request, *args, **kwargs):
        allowed_fields = {
            'avatar', 'bio',
            'is_client', 'is_commercial', 'is_support',
            'is_manager', 'is_comptable'
        }
        data = {k: v for k, v in request.data.items() if k in allowed_fields}

        if not data:
            return Response({"detail": "Aucun champ modifiable fourni."},
                            status=status.HTTP_400_BAD_REQUEST)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class UpdateLastConnectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user.last_connection = timezone.now()
        user.save()
        return Response({"detail": "Connexion enregistrée."})

class UserStatusViewSet(ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


class GroupMessageViewSet(viewsets.ModelViewSet):
    queryset = GroupMessage.objects.all().order_by('-timestamp')[:50]
    serializer_class = GroupMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['DELETE'])
@permission_classes([IsManagerUser]) 
def d_msg(request):
    GroupMessage.objects.all().delete()
    return Response({"message": "All group messages deleted."}, status=status.HTTP_204_NO_CONTENT)
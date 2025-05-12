# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet,UpdateLastConnectionView,UserStatusViewSet,GroupMessageViewSet,d_msg
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'mng-profiles', ProfileViewSet)
router.register(r'users-status', UserStatusViewSet, basename='user-status')
router.register(r'group-messages', GroupMessageViewSet, basename='group-message')

urlpatterns = [
    path('', include(router.urls)),
    path('update-connection/', UpdateLastConnectionView.as_view(), name='update_connection'),
    path('g-mgs-d/', d_msg, name='delete_all_messages'),

    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


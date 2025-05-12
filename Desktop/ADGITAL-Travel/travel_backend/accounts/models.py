from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    adresse = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    last_connection = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    is_client = models.BooleanField(default=True)
    is_commercial = models.BooleanField(default=False)
    is_support = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    is_comptable = models.BooleanField(default=False)


class GroupMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"

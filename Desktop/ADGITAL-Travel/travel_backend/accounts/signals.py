from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from django.utils import timezone
from .models import CustomUser, Profile

@receiver(post_save, sender=CustomUser)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=CustomUser)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

import logging

logger = logging.getLogger(__name__)

@receiver(user_logged_in)
def update_last_connection(sender, request, user, **kwargs):
    logger.info(f"User {user.username} logged in at {timezone.now()}")
    user.last_connection = timezone.now()
    user.save()
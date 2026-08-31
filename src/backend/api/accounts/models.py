from django.db import models
from django.contrib.auth.models import AbstractUser

from api.online.models import User


class CustomUser(AbstractUser):
    """
    カスタムユーザモデル

    Attributes
    ----------
    user : OneToOneField
        ユーザ
    """
    user = models.OneToOneField(User, models.DO_NOTHING, blank=True, null=True)
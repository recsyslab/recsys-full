from django.core.exceptions import ImproperlyConfigured
from .base import *
import os

# 本番では DJANGO_SECRET_KEY を必須とする（未設定なら起動時に例外で落とす）。
try:
    SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
except KeyError as exc:
    raise ImproperlyConfigured(
        'DJANGO_SECRET_KEY environment variable must be set in production.'
    ) from exc
SIMPLE_JWT = {**SIMPLE_JWT, 'SIGNING_KEY': os.environ.get('JWT_SIGNING_KEY', SECRET_KEY)}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'recsys_full',
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': '',
        'PORT': '',
    }
}

DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")

BACKEND_BASE_URL = os.environ.get("BASE_URL", "").split(",")
OMDB_API_BASE_URL = os.environ.get('OMDB_API_BASE_URL', 'https://www.omdbapi.com/')
OMDB_API_KEY = os.environ.get('OMDB_API_KEY')

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    # ロガーの設定
    'loggers': {
        # Djangoが利用するロガー
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
        },
        # onlineアプリケーションが利用するロガー
        'online': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },

    # ハンドラの設定
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/django.log'),
            'formatter': 'prod',
            'when': 'D',        # ログローテーション（新しいファイルへの切り替え）間隔の単位（D=日）
            'interval': 1,      # ログローテーション間隔（1日単位）
            'backupCount': 7,   # 保存しておくログファイル数
        },
    },

    # フォーマッタの設定
    'formatters': {
        'prod': {
            'format': '\t'.join([
                '%(asctime)s',
                '[%(levelname)s]',
                '%(pathname)s(Line:%(lineno)d)',
                '%(message)s',
            ])
        },
    },
}
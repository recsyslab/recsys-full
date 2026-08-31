from .base import *
import os
import logging

# ローカル開発専用の既定鍵（DJANGO_SECRET_KEY が未設定の場合のみ使用。本番では使用不可）。
if not SECRET_KEY:
    SECRET_KEY = 'django-insecure-local-dev-only-do-not-use-in-production'
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

class SQLColorFormatter(logging.Formatter):
    LOG_COLOR = "\033[96m"
    RESET = "\033[0m"

    def format(self, record):
        message = super().format(record)
        return f"{self.LOG_COLOR}{message}{self.RESET}"

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'colored_sql': {
            '()': 'config.settings.development.SQLColorFormatter',
            'format': '%(levelname)s %(message)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'colored_sql',
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        }
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

OMDB_API_BASE_URL = os.environ.get('OMDB_API_BASE_URL', 'https://www.omdbapi.com/')
OMDB_API_KEY = os.environ.get('OMDB_API_KEY')
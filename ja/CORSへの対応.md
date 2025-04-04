---
title: CORSへの対応
layout: default
---

{% include header.html %}

{% raw %}

# CORSへの対応

## パッケージのインストール
```bash
(recsys_full) backend$ pip install django-cors-headers
(recsys_full) backend$ pip freeze
...（略）...
django-cors-headers==4.7.0
...（略）...
```

## 設定ファイル
`backend/config/settings/base.py`
```py
...（略）...
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'api.online.apps.OnlineConfig',
    'corsheaders',  # <- 追加
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <- 追加
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ↓追加
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000"
]
# ↑追加

ROOT_URLCONF = 'config.urls'
...（略）...
```

{% endraw %}

---
title: CORSへの対応
layout: default
---

{% include header.html %}

{% raw %}

# CORS への対応

## パッケージのインストール

```bash
(recsys_full) backend$
 pip install django-cors-headers

(recsys_full) backend$ pip freeze
...（略）...
django-cors-headers==4.9.0
...（略）...
```

## 設定ファイル

`src/backend/config/settings/base.py`

```py
...（略）...
INSTALLED_APPS = [
    ...（略）...
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',  # <- 追加
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <- 1行目に追加
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
...（略）...
```

`src/backend/config/settings/development.py`

```py
...（略）...
# ↓追加
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
# ↑追加
```

{% endraw %}

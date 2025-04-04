---
title: onlineアプリケーションの作成
layout: default
---

{% include header.html %}

{% raw %}

# onlineアプリケーションの作成

## apiディレクトリの作成
```bash
(recsys_full) backend$ mkdir api/
```

## onlineアプリケーションの作成
```bash
(recsys_full) backend$ cd api/
(recsys_full) backend/api$ django-admin startapp online
(recsys_full) backend/api$ cd ../
(recsys_full) backend$ tree -a
.
├── .gitignore
├── api
│   └── online
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── migrations
│       │   └── __init__.py
│       ├── models.py
│       ├── tests.py
│       └── views.py
├── config
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-312.pyc
│   │   ├── urls.cpython-312.pyc
│   │   └── wsgi.cpython-312.pyc
│   ├── asgi.py
│   ├── settings
│   │   ├── __pycache__
│   │   │   ├── base.cpython-312.pyc
│   │   │   └── development.cpython-312.pyc
│   │   ├── base.py
│   │   └── development.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py

8 directories, 20 files
```

## アプリケーションの登録
`backend/api/online/apps.py`
```py
from django.apps import AppConfig


class OnlineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.online'  # <- api.を追加
```

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

    'api.online.apps.OnlineConfig',  # <- 追加
]
...（略）...
```

#### 参考
1. 株式会社オープントーン，佐藤大輔，伊東直喜，上野啓二，『実装で学ぶフルスタックWeb開発 エンジニアの視野と知識を広げる「一気通貫」型ハンズオン』，翔泳社，2023．
   - 4-3 バックエンド（API）とフロントエンド（画面）の連携

{% endraw %}

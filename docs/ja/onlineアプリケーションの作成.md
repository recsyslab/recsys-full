---
title: onlineアプリケーションの作成
layout: default
---

{% include header.html %}

{% raw %}

# online アプリケーションの作成

## api ディレクトリの作成

```bash
(recsys_full) backend$ mkdir api/
```

## online アプリケーションの作成

```bash
(recsys_full) backend$ cd api/
(recsys_full) backend/api$ django-admin startapp online
(recsys_full) backend/api$ tree -a online/
online/
├── __init__.py
├── admin.py
├── apps.py
├── migrations
│   └── __init__.py
├── models.py
├── tests.py
├── utils.py
└── views.py

2 directories, 8 files
```

## online アプリケーションの登録

`src/backend/api/online/apps.py`

```py
from django.apps import AppConfig


class OnlineConfig(AppConfig):
    name = 'api.online'  # <- api.を追加
```

`src/backend/config/settings/base.py`

```py
...（略）...
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.postgres',
    'api.online.apps.OnlineConfig',  # <- 追加
]
...（略）...
```

#### 参考

1. 株式会社オープントーン，佐藤大輔，伊東直喜，上野啓二，『実装で学ぶフルスタック Web 開発 エンジニアの視野と知識を広げる「一気通貫」型ハンズオン』，翔泳社，2023．
   - 4-3 バックエンド（API）とフロントエンド（画面）の連携

{% endraw %}

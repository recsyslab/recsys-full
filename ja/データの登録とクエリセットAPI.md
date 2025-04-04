---
title: データの登録とクエリセットAPI
layout: default
---

{% include header.html %}

{% raw %}

# データの登録とクエリセットAPI

## データの登録
```bash
offline/data$
 psql recsys_full -U postgres -c "\copy movies (id, title, year, imdb_id, tmdb_id) from 'movies.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy genres (id, name) from 'genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy movies_genres (movie_id, genre_id) from 'movies_genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

## データの確認
```pgsql
recsys_full=#
 SELECT * FROM movies;
 SELECT * FROM genres;
 SELECT movie_id, title, genre_id, name AS genre_name FROM movies_genres t1 JOIN movies t2 ON t1.movie_id = t2.id JOIN genres t3 ON t1.genre_id = t3.id;
```

## クエリセットAPI
```bash
(recsys_full) backend$ python manage.py shell --settings config.settings.development
>>> from api.online.models import Movie, Genre
>>> Movie.objects.get(pk=1)
>>> Movie.objects.all()
>>> Movie.objects.filter(year__gte=2015)
>>> Movie.objects.filter(title__icontains='star wars')
>>> Genre.objects.all()
>>> Movie.objects.filter(genres__name='Action')
```

#### 参考
1. 株式会社オープントーン，佐藤大輔，伊東直喜，上野啓二，『実装で学ぶフルスタックWeb開発 エンジニアの視野と知識を広げる「一気通貫」型ハンズオン』，翔泳社，2023．
   - 6-5 参照系APIの作成
1. [はじめての Django アプリ作成、その2 \| Django ドキュメント \| Django](https://docs.djangoproject.com/ja/4.2/intro/tutorial02/#playing-with-the-api)
1. 横瀬明仁，『現場で使える Django の教科書《基礎編》』，2018．
   - 第6章 モデル (Model)

{% endraw %}

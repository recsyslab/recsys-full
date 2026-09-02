---
title: データの登録とクエリセットAPI
layout: default
---

{% include header.html %}

{% raw %}

# データの登録とクエリセット API

## データの登録

```bash
offline$
 psql recsys_full -U postgres -c "\copy m_movies (movie_id, title, year, imdb_id, tmdb_id) from 'data/movies.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy m_genres (genre_id, genre_name) from 'data/genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy m_movies_genres (id, movie_id, genre_id) from 'data/movies_genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

## データの確認

```pgsql
recsys_full=#
 SELECT * FROM m_movies;
 SELECT * FROM m_genres;
 SELECT movie_id, title, genre_id, genre_name FROM m_movies t1 NATURAL JOIN m_movies_genres t2 NATURAL JOIN m_genres t3;
```

## クエリセット API

```bash
(recsys_full) backend$ python manage.py shell
 from api.online.models import Movie, Genre
 Movie.objects.get(pk=1)
 Movie.objects.all()
 Movie.objects.filter(year__gte=2015)
 Movie.objects.filter(title__icontains='star wars')
 Genre.objects.all()
 MovieGenre.objects.filter(genre__genre_name='Action')
 [Ctrl+D]
```

#### 参考

1. 株式会社オープントーン，佐藤大輔，伊東直喜，上野啓二，『実装で学ぶフルスタック Web 開発 エンジニアの視野と知識を広げる「一気通貫」型ハンズオン』，翔泳社，2023．
   - 6-5 参照系 API の作成
1. [はじめての Django アプリ作成、その 2 \| Django ドキュメント \| Django](https://docs.djangoproject.com/ja/4.2/intro/tutorial02/#playing-with-the-api)
1. 横瀬明仁，『現場で使える Django の教科書《基礎編》』，2018．
   - 第 6 章 モデル (Model)

{% endraw %}

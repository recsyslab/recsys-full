---
title: MovieLensデータベースの準備
layout: default
---

{% include header.html %}

{% raw %}

# MovieLensデータベースの準備

## データベースへの接続
```bash
$ sudo -u postgres psql
postgres=#
```

## データベースの作成
```pgsql
postgres=# CREATE DATABASE ml_latest_small ENCODING 'UTF8';
postgres=# \c ml_latest_small
ml_latest_small=#
```

## 各テーブルの作成
```pgsql
ml_latest_small=#
 CREATE TABLE users (
  user_id INT,
  user_name TEXT NOT NULL,
  PRIMARY KEY(user_id)
 );

 CREATE TABLE movies (
  movie_id INT,
  title TEXT NOT NULL,
  year INT,
  PRIMARY KEY(movie_id)
 );

 CREATE TABLE genres (
  genre_id INT,
  genre_name TEXT NOT NULL,
  PRIMARY KEY(genre_id)
 );

 CREATE TABLE movies_genres (
  movie_id INT,
  genre_id INT,
  PRIMARY KEY(movie_id, genre_id),
  FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
  FOREIGN KEY(genre_id) REFERENCES genres(genre_id)
 );

 CREATE TABLE ratings (
  user_id INT, movie_id INT, rating NUMERIC, rated_at TIMESTAMP,
  PRIMARY KEY(user_id, movie_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
 );

 CREATE TABLE tags (
  user_id INT, movie_id INT, tag TEXT, tagged_at TIMESTAMP,
  PRIMARY KEY(user_id, movie_id, tag),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
 );

 CREATE TABLE links (
  movie_id INT,
  imdb_id INT,
  tmdb_id INT,
  PRIMARY KEY(movie_id),
  FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
 );
```

## テーブル一覧の確認
```pgsql
ml_latest_small_=# \dt
             List of relations
 Schema |     Name      | Type  |  Owner   
--------+---------------+-------+----------
 public | genres        | table | postgres
 public | links         | table | postgres
 public | movies        | table | postgres
 public | movies_genres | table | postgres
 public | ratings       | table | postgres
 public | tags          | table | postgres
 public | users         | table | postgres
(7 rows)
```

{% endraw %}

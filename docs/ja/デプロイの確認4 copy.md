---
title: デプロイの確認4
layout: default
---

{% include header.html %}

{% raw %}

# デプロイの確認 4

## クライアント側

### yarn run build のテスト

```bash
frontend$ yarn run build
```

### リポジトリのプッシュ

```bash
$
 cd ~/dev/recsys-full/
 git add *
 git commit -m "add *"
 git push
 git status
```

## バックエンドサーバ側

### リポジトリのプル

```bash
rsl@＊:$
 cd ~/dev/recsys-full/
 git pull
 git status
```

### 評価履歴の蓄積

ブラウザで下記 URL にアクセスして、何件か映画に対して評価値を与えてください。

- [https://recsys-full.vercel.app/](https://recsys-full.vercel.app/)

### データのバックアップ

```bash
rsl@＊:offline$
 mkdir bkup/
 cp -r data/ bkup/data/
 ls bkup/data/
```

### データの準備

```bash
rsl@＊:offline$
 psql recsys_full -U postgres -c "\copy (SELECT user_id, email_encrypted, email_hash FROM t_users ORDER BY user_id ASC) to 'data/users.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy (SELECT movie_id, title, year, imdb_id, tmdb_id FROM m_movies ORDER BY movie_id ASC) to 'data/movies.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy (SELECT genre_id, genre_name FROM m_genres ORDER BY genre_id ASC) to 'data/genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy (SELECT id, movie_id, genre_id FROM m_movies_genres ORDER BY id ASC) to 'data/movies_genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy (SELECT id, user_id, movie_id, rating, rated_at FROM t_users_movies_rating ORDER BY id ASC) to 'data/ratings.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

### データの確認

```bash
rsl@＊:offline$ ls data/
genres.csv  movies.csv  movies_genres.csv  ratings.csv  reclist_bpr.csv  reclist_movie_similarity.csv  reclist_popularity.csv  tags.csv  users.csv

rsl@＊:offline$
 less data/users.csv
 less data/movies.csv
 less data/genres.csv
 less data/movies_genres.csv
 less data/ratings.csv
 less data/tags.csv
```

### リポジトリのプッシュ

```bash
rsl@＊:$
 cd ~/dev/recsys-full/
 git add src/offline/data/
 git commit -m "src/offline/data/"
 git push
 git status
```

## クライアント側

### データのバックアップ

```bash
offline$
 cp -r data/ bkup/data/
 ls bkup/data/
```

### リポジトリのプル

```bash
$
 cd ~/dev/recsys-full/
 git pull
 git status
```

### データの確認

```bash
offline$ ls data/
genres.csv  movies.csv  movies_genres.csv  ratings.csv  reclist_bpr.csv  reclist_movie_similarity.csv  reclist_popularity.csv  tags.csv  users.csv

offline$
 less data/users.csv
 less data/movies.csv
 less data/genres.csv
 less data/movies_genres.csv
 less data/ratings.csv
 less data/tags.csv
```

### 推薦システムの実行

```bash
(recsys_full) offline$ python src/update.py --ini src/offline.ini
# ...（30分程度）...
```

### 結果の確認

```bash
(recsys_full) offline$ tree data/
data/
├── genres.csv
├── movies.csv
├── movies_genres.csv
├── ratings.csv
├── reclist_bpr.csv
├── reclist_movie_similarity.csv
├── reclist_popularity.csv
├── tags.csv
└── users.csv

1 directory, 9 files

(recsys_full) offline$
 less data/reclist_popularity.csv
 less data/reclist_movie_similarity.csv
 less data/reclist_bpr.csv
```

### リポジトリのプッシュ

```bash
$
 cd ~/dev/recsys-full/
 git add *
 git commit -m "add *"
 git push
 git status
```

## バックエンドサーバ側

### リポジトリのプル

```bash
rsl@＊:$
 cd ~/dev/recsys-full/
 git pull
 git status
```

### データの削除

```bash
recsys_full=#
 TRUNCATE r_reclist_popularity;
 TRUNCATE r_reclist_movie_similarity;
 TRUNCATE r_reclist_bpr;
```

### データの登録

```bash
rsl@＊:offline$
 psql recsys_full -U postgres -c "\copy r_reclist_popularity (id, target_genre_id, rank, movie_id, score) from 'data/reclist_popularity.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy r_reclist_movie_similarity (id, base_movie_id, rank, movie_id, score) from 'data/reclist_movie_similarity.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql recsys_full -U postgres -c "\copy r_reclist_bpr (id, user_id, movie_id, score, rank) from 'data/reclist_bpr.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

### Nginx の再読込と Gunicorn の再起動

```bash
(recsys_full) rsl@＊:backend$
 sudo systemctl reload nginx
 pkill gunicorn
 gunicorn --bind 127.0.0.1:8000 config.wsgi:application -D
 ps ax | grep gunicorn
```

### ログの確認

```bash
rsl@＊:backend$ less logs/django.log
```

### 実行確認

下記 URL にアクセスし、各推薦リストが表示されることを確認してください。特に、サインイン後は「あなたにおすすめの映画」が表示されるようになっています。

- [https://recsys-full.vercel.app/](https://recsys-full.vercel.app/)

{% endraw %}

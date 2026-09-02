---
title: MovieLensデータセットの取込み
layout: default
---

{% include header.html %}

{% raw %}

# MovieLens データセットの取込み

## ダウンロード

1. 下記から MovieLens データセットをダウンロードする。
   - **[MovieLens](https://grouplens.org/datasets/movielens/)**
   - **MovieLens Latest Datasets**: `ml-latest-small.zip`

## 展開

```bash
offline$ mv ~/Downloads/ml-latest-small.zip local/
offline$ unzip local/ml-latest-small.zip -d local/
Archive:  local/ml-latest-small.zip
   creating: local/ml-latest-small/
  inflating: local/ml-latest-small/links.csv
  inflating: local/ml-latest-small/tags.csv
  inflating: local/ml-latest-small/ratings.csv
  inflating: local/ml-latest-small/README.txt
  inflating: local/ml-latest-small/movies.csv

offline$ ls local/ml-latest-small/
README.txt  links.csv  movies.csv  ratings.csv  tags.csv

offline$ rm -f local/ml-latest-small.zip
```

## ml2rdb.py の準備

1. 下記ファイルをダウンロードする。
   - [recsyslab / recsys-full / src / offline / src /](https://github.com/recsyslab/recsys-full/tree/main/src/offline/src)
     - `ml2rdb.py`

```bash
offline$ mv ~/Downloads/ml2rdb.py src/
offline$ ls src/
ml2rdb.py
```

## RDB 形式への変換

```bash
(recsys_full) offline$ e$ python src/ml2rdb.py --in_dir local/ml-latest-small/ --out_dir local/ml-rdb/
processing ratings: 100%|███████████████████████████████████████████████████████████████████████████████████████████████████████████████| 100836/100836 [00:00<00:00, 602568.55it/s]
processing tags: 100%|██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 3683/3683 [00:00<00:00, 584672.10it/s]
processing users: 100%|██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 610/610 [00:00<00:00, 1799244.33it/s]
processing gernes: 100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 20/20 [00:00<00:00, 911805.22it/s]
processing movies: 100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9742/9742 [00:00<00:00, 366324.28it/s]
processing links: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9742/9742 [00:00<00:00, 623345.33it/s]
elapsed_time:0.531[sec]
```

## データの確認

```bash
offline$ ls local/ml-rdb/
genres.csv  links.csv  movies.csv  movies_genres.csv  ratings.csv  tags.csv  users.csv

offline$
 less local/ml-rdb/genres.csv
 less local/ml-rdb/links.csv
 less local/ml-rdb/movies.csv
 less local/ml-rdb/movies_genres.csv
 less local/ml-rdb/ratings.csv
 less local/ml-rdb/tags.csv
```

## MovieLens データベースへの取り込み

```bash
offline$
 psql ml_latest_small -U postgres -c "\copy users from 'local/ml-rdb/users.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy movies from 'local/ml-rdb/movies.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy genres from 'local/ml-rdb/genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy movies_genres from 'local/ml-rdb/movies_genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy ratings from 'local/ml-rdb/ratings.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy tags from 'local/ml-rdb/tags.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy links from 'local/ml-rdb/links.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

## テーブル内容の確認

```pgsql
ml_latest_small=#
 SELECT * FROM users;
 SELECT * FROM movies;
 SELECT * FROM genres;
 SELECT movie_id, title, genre_id, genre_name FROM movies_genres NATURAL JOIN movies NATURAL JOIN genres ORDER BY movie_id ASC, genre_id ASC;
 SELECT user_id, user_name, movie_id, title, rating, rated_at FROM ratings NATURAL JOIN users NATURAL JOIN movies ORDER BY user_id ASC, movie_id ASC;
 SELECT user_id, user_name, movie_id, title, tag, tagged_at FROM tags NATURAL JOIN users NATURAL JOIN movies ORDER BY user_id ASC, movie_id ASC;
 SELECT * FROM links;
```

#### 参考

1. [MovieLens \| GroupLens](https://grouplens.org/datasets/movielens/)

{% endraw %}

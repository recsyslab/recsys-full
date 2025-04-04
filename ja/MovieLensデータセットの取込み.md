---
title: MovieLensデータセットの取込み
layout: default
---

{% include header.html %}

{% raw %}

# MovieLensデータセットの取込み

## ダウンロード
1. 下記からMovieLensデータセットをダウンロードする。
   - **[MovieLens](https://grouplens.org/datasets/movielens/)**
   - **MovieLens Latest Datasets**: `ml-latest-small.zip`

## 展開
```bash
offline$ cd data/
offline/data$ mv ~/Downloads/ml-latest-small.zip .
offline/data$ unzip ml-latest-small.zip
Archive:  ml-latest-small.zip
   creating: ml-latest-small/
  inflating: ml-latest-small/links.csv  
  inflating: ml-latest-small/tags.csv  
  inflating: ml-latest-small/ratings.csv  
  inflating: ml-latest-small/README.txt  
  inflating: ml-latest-small/movies.csv  
offline/data$ ls ml-latest-small/
README.txt  links.csv  movies.csv  ratings.csv  tags.csv
offline/data$ rm -f ml-latest-small.zip
```

## ml2rdb.pyの準備
1. 下記ファイルをダウンロードする。
   - [recsyslab / recsys-full / src / offline / src /](https://github.com/recsyslab/recsys-full/tree/main/src/offline/src)
     - `ml2rdb.py`

```bash
offline/data$ cd ../src/
offline/src$ mv ~/Downloads/ml2rdb.py .
offline/src$ ls
ml2rdb.py
```

## RDB形式への変換
```bash
(recsys_full) offline/src$ python ml2rdb.py --in_dir ../data/ml-latest-small/ --out_dir ../data/ml-rdb/
processing ratings: 100%|█████████████████████████████████████| 100836/100836 [00:00<00:00, 621593.90it/s]
processing tags: 100%|████████████████████████████████████████████| 3683/3683 [00:00<00:00, 736618.26it/s]
processing users: 100%|████████████████████████████████████████████| 610/610 [00:00<00:00, 2754063.98it/s]
processing gernes: 100%|█████████████████████████████████████████████| 20/20 [00:00<00:00, 1198372.57it/s]
processing movies: 100%|██████████████████████████████████████████| 9742/9742 [00:00<00:00, 380870.31it/s]
processing linkss: 100%|████████████████████████████████████████████| 9742/9742 [00:00<00:00, 714751.43it/s]
elapsed_time:0.599[sec]
```

## データの確認
```bash
offline/src$ cd ../data/ml-rdb/
offline/data/ml-rdb$ ls
genres.csv  links.csv  movies.csv  movies_genres.csv  ratings.csv  tags.csv  users.csv
offline/data/ml-rdb$
 less genres.csv
 less links.csv
 less movies.csv
 less movies_genres.csv
 less ratings.csv
 less tags.csv
```

## MovieLensデータベースへの取込み
```bash
offline/data/ml-rdb$
 psql ml_latest_small -U postgres -c "\copy users from 'users.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy movies from 'movies.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy genres from 'genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy movies_genres from 'movies_genres.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy ratings from 'ratings.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy tags from 'tags.csv' with delimiter E'\t' csv header encoding 'UTF8'"
 psql ml_latest_small -U postgres -c "\copy links from 'links.csv' with delimiter E'\t' csv header encoding 'UTF8'"
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

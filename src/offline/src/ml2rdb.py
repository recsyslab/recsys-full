"""MovieLens Latest DatasetsをRDB形式に変換する。
@version 20250325
"""
import argparse
import pathlib
import time
from tqdm import tqdm

import re
import datetime

import numpy as np
import pandas as pd

from typing import Tuple


# ジャンル辞書
GENRES = {
    'Action': 1,
    'Adventure': 2,
    'Animation': 3,
    'Children': 4,
    'Comedy': 5,
    'Crime': 6,
    'Documentary': 7,
    'Drama': 8,
    'Fantasy': 9,
    'Film-Noir': 10,
    'Horror': 11,
    'Musical': 12,
    'Mystery': 13,
    'Romance': 14,
    'Sci-Fi': 15,
    'Thriller': 16,
    'War': 17,
    'Western': 18,
    'IMAX': 19,
    '(no genres listed)': -1,
}


def get_title_year(src_title: str) -> Tuple[str, int]:
  """公開年が含まれた映画タイトルから映画タイトル、公開年を抽出する。
  
  Parameters
  ----------
  src_title : str
      元の映画タイトル
  
  Returns
  -------
  title : str
      映画タイトル
  year : int
      公開年
  """
  pattern = r'^(.*)\((\d{4})\)$'
  src_title = src_title.strip()
  values = re.findall(pattern, src_title)
  title = pd.NA
  year = pd.NA
  if len(values) > 0:
      title = values[0][0].strip()
      year = int(values[0][1])
  else:
      title = src_title
  return title, year


start = time.time()

parser = argparse.ArgumentParser()
parser.add_argument('--in_dir', type=str)
parser.add_argument('--out_dir', type=str)

args = parser.parse_args()
# args = parser.parse_args(args=[
#     '--in_dir', '../data/ml-latest-small/',
#     '--out_dir', '../data/ml-rdb/',
# ])


# データセットを読み込む。
in_dir = pathlib.Path(args.in_dir)
df_ratings = pd.read_csv(in_dir / 'ratings.csv', index_col=None, sep=',')
df_tags = pd.read_csv(in_dir / 'tags.csv', index_col=None, sep=',')
df_movies = pd.read_csv(in_dir / 'movies.csv', index_col=None, sep=',')
df_links = pd.read_csv(in_dir / 'links.csv', index_col=None, sep=',')


# 評価履歴データを作成する。
user_ids = set()
ratings = []
for rating_ in tqdm(df_ratings.itertuples(), total=len(df_ratings), desc='processing ratings'):
    user_id = rating_.userId
    user_ids.add(user_id)
    
    movie_id = rating_.movieId
    rating = rating_.rating
    rated_at = datetime.datetime.fromtimestamp(rating_.timestamp)
    ratings.append([user_id, movie_id, rating, rated_at])

# タグ履歴データを作成する。
tags = []
for tag_ in tqdm(df_tags.itertuples(), total=len(df_tags), desc='processing tags'):
    user_id = tag_.userId
    user_ids.add(user_id)
    
    movie_id = tag_.movieId
    tag = tag_.tag
    tagged_at = datetime.datetime.fromtimestamp(tag_.timestamp)
    tags.append([user_id, movie_id, tag, tagged_at])

# ユーザデータを作成する。
user_ids = sorted(list(user_ids))
users = []
for user_id in tqdm(user_ids, total=len(user_ids), desc='processing users'):
    user_name = 'user' + str(user_id).zfill(3)
    users.append([user_id, user_name])

# ジャンルデータを作成する。
genres = []
for k, v in tqdm(GENRES.items(), total=len(GENRES), desc='processing gernes'):
    genre_id = v
    genre_name = k
    genres.append([genre_id, genre_name])

# 映画データ、映画-ジャンルデータを作成する。
movies = []
movies_genres = []
for movie in tqdm(df_movies.itertuples(), total=len(df_movies), desc='processing movies'):
    movie_id = movie.movieId
    
    src_title = movie.title
    title, year = get_title_year(src_title)
    movies.append([movie_id, title, year])
    
    src_genres = movie.genres.split('|')
    for genre in src_genres:
        genre_id = GENRES[genre]
        movies_genres.append([movie_id, genre_id])

# 映画-リンクデータを作成する。
links = []
for link in tqdm(df_links.itertuples(), total=len(df_links), desc='processing links'):
    movie_id = link.movieId
    imdb_id = link.imdbId
    tmdb_id = pd.NA if np.isnan(link.tmdbId) else int(link.tmdbId)
    links.append([movie_id, imdb_id, tmdb_id])


# 各データを出力する。
out_dir = pathlib.Path(args.out_dir)
out_dir.mkdir(exist_ok=True)

df = pd.DataFrame(ratings, columns=['user_id', 'movie_id', 'rating', 'rated_at'])
df.to_csv(out_dir / 'ratings.csv', header=True, index=False, encoding='utf-8', sep='\t')

df = pd.DataFrame(tags, columns=['user_id', 'movie_id', 'tag', 'tagged_at'])
df.to_csv(out_dir / 'tags.csv', header=True, index=False, encoding='utf-8', sep='\t')

df = pd.DataFrame(users, columns=['user_id', 'user_name'])
df.to_csv(out_dir / 'users.csv', header=True, index=False, encoding='utf-8', sep='\t')

df = pd.DataFrame(movies, columns=['movie_id', 'title', 'year'])
df.to_csv(out_dir / 'movies.csv', header=True, index=False, encoding='utf-8', sep='\t')

df = pd.DataFrame(genres, columns=['genre_id', 'genre_name'])
df.to_csv(out_dir / 'genres.csv', header=True, index=False, encoding='utf-8', sep='\t')

df = pd.DataFrame(movies_genres, columns=['movie_id', 'genre_id'])
df.to_csv(out_dir / 'movies_genres.csv', header=True, index=False, encoding='utf-8', sep='\t')

df = pd.DataFrame(links, columns=['movie_id', 'imdb_id', 'tmdb_id'])
df.to_csv(out_dir / 'links.csv', header=True, index=False, encoding='utf-8', sep='\t')


elapsed_time = time.time() - start
print('elapsed_time:{:.3f}'.format(elapsed_time) + '[sec]')

"""推薦結果を更新する。
@version 20251126
"""
import argparse
import configparser
import pathlib
import time

import pandas as pd

from utils.dataset import Dataset
from recommenders.popularity_recommender import PopularityRecommender
from recommenders.movie_similarity_recommender import MovieSimilarityRecommender
from recommenders.bpr_recommender import BPRRecommender


start = time.time()

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--ini', type=str)
args = parser.parse_args()

config = configparser.ConfigParser()
config.read(args.ini)

data_path = pathlib.Path(config['dataset']['data_path'])
data_path.mkdir(exist_ok=True)
local_path = pathlib.Path(config['local']['local_path'])
local_path.mkdir(exist_ok=True)

dataset = Dataset(
    str(data_path),
    str(local_path),
    config['dataset']['users_csv'],
    config['dataset']['movies_csv'],
    config['dataset']['ratings_csv'],
    config['dataset']['genres_csv'],
    config['dataset']['movies_genres_csv'],
)

# 各モデルを更新する。
# 評価値行列
if config['setting']['update_rating_matrix'] == 'on':
    dataset.to_rating_matrix(config['local']['rating_matrix_csv'])

# 映画-映画類似度行列
if config['setting']['update_movies_movies_similarity_matrix'] == 'on':
    dataset.read_rating_matrix(config['local']['rating_matrix_csv'])
    dataset.to_movies_movies_similarity_matrix(config['local']['movies_movies_similarity_matrix_csv'])

# Atomic Files
if config['setting']['update_atomic'] == 'on':
    dataset.to_atomic(config['local']['dataset_name'])


# 各推薦システムを実行し、推薦リストをCSVファイルに出力する。
# 人気ベース推薦システム
if config['setting']['popularity_recommender'] == 'on':
    recommender = PopularityRecommender()
    recommend_result = recommender.recommend(
        dataset,
        top_k=20,
        minimum_count_rating=50,
        minimum_mean_rating=3.5)
    recommend_result.to_csv(data_path / config['reclist']['reclist_popularity_csv'])

# 映画類似度ベース推薦システム
if config['setting']['movie_similarity_recommender'] == 'on':
    dataset.read_rating_matrix(config['local']['rating_matrix_csv'])
    dataset.read_movies_movies_similarity_matrix(config['local']['movies_movies_similarity_matrix_csv'])
    recommender = MovieSimilarityRecommender()
    recommend_result = recommender.recommend(
        dataset,
        top_k=20,
        theta=0.1)
    recommend_result.to_csv(data_path / config['reclist']['reclist_movie_similarity_csv'])

# BPRベース推薦システム
if config['setting']['bpr_recommender'] == 'on':
    recommender = BPRRecommender()
    recommend_result = recommender.recommend(
        dataset,
        top_k=20,
        config_yaml=config['setting']['config_yaml'],
        dataset_name=config['local']['dataset_name'])
    recommend_result.to_csv(data_path / config['reclist']['reclist_bpr_csv'])


elapsed_time = time.time() - start
print('elapsed_time:{:.3f}'.format(elapsed_time) + '[sec]')

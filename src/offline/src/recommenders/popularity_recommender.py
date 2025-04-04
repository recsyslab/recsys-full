from tqdm import tqdm
import pandas as pd

from .base_recommender import BaseRecommender
from utils.dataset import Dataset
from utils.recommend_result import RecommendResult


class PopularityRecommender(BaseRecommender):
    """人気ベース推薦システム
    """

    def recommend(self, dataset: Dataset, top_k: int, **kwargs) -> RecommendResult:
        """人気ベース推薦システムによる推薦結果を返す。

        Parameters
        ----------
        dataset : Dataset
            データセット
        top_k : int
            top_k件
        minimum_count_rating : int
            評価数のしきい値
        minimum_mean_rating : float
            平均評価値のしきい値

        Returns
        -------
        RecommendResult
            推薦結果
        """
        # パラメタを取得する。
        minimum_count_rating = kwargs.get('minimum_count_rating', 0)
        minimum_mean_rating = kwargs.get('minimum_mean_rating', 0)

        # 必要なデータを用意する。
        df_ratings = pd.merge(dataset.df_ratings, dataset.df_movies_genres, on='movie_id')
        grouped_df = df_ratings.groupby(['movie_id', 'genre_id'], as_index=False)['rating'].agg(['count', 'mean'])
        genre_ids = list(dataset.df_genres['id'])

        # 推薦リストデータフレームを用意する。
        df_recommend_list = pd.DataFrame()

        # ジャンルごとにtop_k推薦リストを作成する。
        for genre_id in tqdm(genre_ids, total=len(genre_ids), desc='processing PopularityRecommender.recommend'):
            if genre_id < 0: continue
            df = grouped_df.copy()
            df = df.query('genre_id==@genre_id')
            df = df.query('count>=@minimum_count_rating and mean>=@minimum_mean_rating')
            
            # 評価値数の降順に順位を付ける。
            df.loc[:, ['rank']] = df['count'].rank(axis=0, ascending=False, method='first')
            
            # ジャンルごとにtop_k件を残す。
            df_recommend = df.sort_values(['genre_id', 'rank'], ascending=True)
            df_recommend = df_recommend.head(int(top_k))
            
            # 推薦リストを結合する。
            df_recommend_list = pd.concat([df_recommend_list , df_recommend], ignore_index=True)

        # gnere_idとrankを連結してidを作成し、列を並べ替える。
        df_recommend_list['rank'] = df_recommend_list['rank'].astype(int)
        df_recommend_list['id'] = df_recommend_list['genre_id'].astype('str').str.zfill(2) + '_' + df_recommend_list['rank'].astype('str').str.zfill(2)
        df_recommend_list = df_recommend_list[['id', 'genre_id', 'rank', 'movie_id', 'count']]
        df_recommend_list = df_recommend_list.rename(columns={'genre_id': 'target_genre_id', 'count': 'score'})

        # 推薦結果を返す。
        recommend_result = RecommendResult(df_recommend_list)
        return recommend_result

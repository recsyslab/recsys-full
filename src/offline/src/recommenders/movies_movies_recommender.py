from tqdm import tqdm
import numpy as np
import pandas as pd

from .base_recommender import BaseRecommender
from utils.dataset import Dataset
from utils.recommend_result import RecommendResult


class MoviesMoviesRecommender(BaseRecommender):
    """映画-映画推薦システム
    """

    def recommend(self, dataset: Dataset, top_k: int, **kwargs) -> RecommendResult:
        """映画-映画推薦システムによる推薦結果を返す。

        Parameters
        ----------
        dataset : Dataset
            データセット
        top_k : int
            top_k件
        theta : float
            類似度のしきい値

        Returns
        -------
        RecommendResult
            推薦結果
        """
        # パラメタを取得する。
        theta = kwargs.get('theta', 0)

        # 必要なデータを用意する。
        R, _, I, _, _, _, S = dataset.load()

        # アイテムごとにtop_k類似アイテム集合を作成する。
        rows = []
        for i in tqdm(range(len(S)), desc='processing MoviesMoviesRecommender.recommend'):
            # 自身のアイテムIDはランキングから除外する。
            S[i][i] = -1
            # top_k件のアイテムID集合を取得する。
            top_k_ids = np.argsort(-S[i])[:int(top_k)]
            # アイテムiとの類似アイテム集合と、各アイテムに対応する類似度を取得する。
            Ii = I[top_k_ids]
            Si = S[i][top_k_ids]
            # 各類似アイテムを推薦リストに追加する。
            for k in range(len(Ii)):
                score = Si[k]
                if score < float(theta): break
                base_movie_id = dataset.movie_ids[I[i]]
                rank = k + 1
                id = str(base_movie_id).zfill(6) + '_' + str(rank).zfill(2)
                movie_id = dataset.movie_ids[Ii[k]]
                rows.append([id, base_movie_id, rank, movie_id, score])

        # 推薦リストデータフレームを作成する。
        df_recommend_list = pd.DataFrame(rows, columns=['id', 'base_movie_id', 'rank', 'movie_id', 'score'])

        # 推薦結果を返す。
        recommend_result = RecommendResult(df_recommend_list)
        return recommend_result
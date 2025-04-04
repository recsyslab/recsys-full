"""
References:
    与謝秀作, 『特集3 最新レコメンドエンジン総実装 協調フィルタリングから深層学習まで』, WEB+DB PRESS Vol.129, pp.69-100, 技術評論社, 2022.
"""
from tqdm import tqdm
import numpy as np
import pandas as pd
np.float_ = np.float64
np.complex_ = np.complex128
np.unicode_ = np.str_

from recbole.config import Config
from recbole.data import create_dataset, data_preparation
from recbole.model.general_recommender import BPR
from recbole.data.interaction import Interaction
from recbole.trainer import Trainer

from .base_recommender import BaseRecommender
from utils.dataset import Dataset
from utils.recommend_result import RecommendResult


class BPRRecommender(BaseRecommender):
    """BPRベース推薦システム
    """

    def recommend(self, dataset: Dataset, top_k: int, **kwargs) -> RecommendResult:
        """BPRベース推薦システムによる推薦結果を返す。

        Parameters
        ----------
        dataset : Dataset
            データセット
        top_k : int
            top_k件
        config_yaml : str
            設定ファイル名
        dataset_name : str
            データセット名

        Returns
        -------
        RecommendResult
            推薦結果
        """
        # パラメタを取得する。
        config_yaml = kwargs.get('config_yaml', 0)
        dataset_name = kwargs.get('dataset_name', 0)
        
        # configを設定する。
        config = Config(model='BPR', dataset=dataset_name, config_file_list=[config_yaml])
        config['data_path'] = '../data/'

        # データセットを作成する。
        rb_dataset = create_dataset(config)
        train_data, valid_data, test_data = data_preparation(config, rb_dataset)

        # BPRモデルを呼び出す。
        model = BPR(config, train_data.dataset).to(config['device'])

        # モデルを学習する。
        trainer = Trainer(config, model)
        best_valid_score, best_valid_result = trainer.fit(train_data, valid_data)

        # モデルを評価する。
        test_result = trainer.evaluate(test_data)

        rank_list = [i+1 for i in range(top_k)]
        user_feature = rb_dataset.get_user_feature().to(config['device'])
        item_feature = rb_dataset.get_item_feature().to(config['device'])

        # 推薦リストデータフレームを用意する。
        df_recommend_list = pd.DataFrame(
            columns=['id', 'user_id', 'movie_id', 'score', 'rank']
        )

        # ユーザごとにtop_k推薦リストを作成する。
        for user_id in tqdm(user_feature['user_id'], total=len(user_feature), desc='processing BPRRecommender.recommend'):
            movie_list = item_feature['movie_id']
            user_list = [user_id.to('cpu').detach().numpy()] * len(item_feature)

            df_predict = pd.DataFrame()
            df_predict['user_id'] = user_list
            df_predict['movie_id'] = movie_list.to('cpu').detach().numpy()

            all_inter = Interaction({
                'user_id': user_id.unsqueeze(0),
                'movie_id': movie_list
            })

            prediction = model.full_sort_predict(all_inter)
            df_predict['score'] = prediction.to('cpu').detach().numpy()

            df_recommend = df_predict.sort_values(
                'score', ascending=False
            )[:top_k]
            df_recommend['rank'] = rank_list

            df_recommend_list = pd.concat([df_recommend_list, df_recommend], ignore_index=True)

        # インデックス0のデータは内部処理用であるので削除する。
        # 参考: https://github.com/RUCAIBox/RecBole/issues/1516
        df_recommend_list = df_recommend_list.query('user_id>0 & movie_id>0')

        # user_id, movie_idを生のuser_id, movie_idに変換する。
        df_recommend_list.loc[:, ['user_id']] -= 1
        df_recommend_list.loc[:, ['movie_id']] -= 1
        df_recommend_list.loc[:, ['user_id']] = dataset.user_ids[df_recommend_list['user_id'].values.astype(int)]
        df_recommend_list.loc[:, ['movie_id']] = dataset.movie_ids[df_recommend_list['movie_id'].values.astype(int)]
        df_recommend_list.loc[:, ['id']] = df_recommend_list['user_id'] + '_' + df_recommend_list['rank'].astype('str').str.zfill(2)

        # 推薦結果を返す。
        recommend_result = RecommendResult(df_recommend_list)
        return recommend_result
        

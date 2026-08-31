"""
References:
    風間正弘, 飯塚洸二郎, 松村優也, 『著推薦システム実践入門 ―仕事で使える導入ガイド』, オライリー・ジャパン, 2022.
"""
from abc import ABC, abstractmethod
from utils.dataset import Dataset
from utils.recommend_result import RecommendResult


class BaseRecommender(ABC):
    """推薦システムの抽象規定クラス
    """

    @abstractmethod
    def recommend(self, dataset: Dataset, top_k: int, **kwargs) -> RecommendResult:
        """推薦システムによる推薦結果を返す。

        Parameters
        ----------
        dataset : Dataset
            データセット
        top_k : int
            top_k件
        **kwargs
            推薦システム固有のパラメタ

        Returns
        -------
        RecommendResult
            推薦結果
        """
        pass
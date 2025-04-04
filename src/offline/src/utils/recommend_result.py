import pandas as pd


class RecommendResult:
    """推薦結果クラス

    Attributes
    ----------
    df_recommend_list: pd.DataFrame
        推薦リストデータフレーム
    """

    def __init__(self, df_recommend_list: pd.DataFrame):
        """コンストラクタ

        Parameters
        ----------
        df_recommend_list: pd.DataFrame
            推薦リストデータフレーム
        """
        self.df_recommend_list = df_recommend_list

    def __str__(self):
        return (
            'df_recommend_list:\n' + str(self.df_recommend_list)
        )

    def to_csv(self, path: str) -> None:
        """推薦リストをCSVファイルに出力する。

        Parameters
        ----------
        path : str
            出力先のパス
        """
        self.df_recommend_list.to_csv(path, index=False, header=True, sep='\t')

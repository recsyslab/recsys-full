from pathlib import Path
from tqdm import tqdm
import numpy as np
import pandas as pd

from typing import Tuple


class Dataset:
    """データセットクラス

    Attributes
    ----------
    data_path : Path
        データパス
    df_users : pd.DataFrame
        ユーザデータフレーム
    df_movies : pd.DataFrame
        映画データフレーム
    df_ratings : pd.DataFrame
        評価値データフレーム
    df_genres : pd.DataFrame
        ジャンルデータフレーム
    df_movies_genres : pd.DataFrame
        映画-ジャンルデータフレーム
    user_ids : np.ndarray
        ユーザIDリスト
    movie_ids : np.ndarray
        映画IDリスト
    df_rating_matrix : pd.DataFrame
        評価値行列データフレーム
    df_movies_movies_similarity_matrix : pd.DataFrame
        映画-映画類似度行列データフレーム
    """

    def __init__(
        self,
        data_path: str,
        users: str,
        movies: str,
        ratings: str,
        genres: str,
        movies_genres: str
    ):
        """コンストラクタ

        Parameters
        ----------
        data_path : str
            データパス
        users : str
            ユーザデータのCSVファイル名
        movies : str
            映画データのCSVファイル名
        ratings : str
            評価値データのCSVファイル名
        genres : str
            ジャンルデータのCSVファイル名
        movies_genres : str
            映画-ジャンルデータのCSVファイル名
        """
        # 各データセットを読み込む。
        self.data_path = Path(data_path)
        self.df_users = pd.read_csv(self.data_path / users, index_col=None, header=0, sep='\t')
        self.df_movies = pd.read_csv(
            self.data_path / movies,
            index_col=None,
            header=0,
            dtype={'year': 'object', 'imdb_id': 'object', 'tmdb_id': 'object'},
            sep='\t'
        )
        self.df_ratings = pd.read_csv(self.data_path / ratings, index_col=None, header=0, sep='\t')
        self.df_genres = pd.read_csv(self.data_path / genres, index_col=None, header=0, sep='\t')
        self.df_movies_genres = pd.read_csv(self.data_path / movies_genres, index_col=None, header=0, sep='\t')

        # ユーザIDリスト、アイテムIDリストを取得する。
        self.user_ids = np.array(self.df_users['id'].drop_duplicates())
        self.movie_ids = np.array(self.df_movies['id'].drop_duplicates())

        self.df_rating_matrix = None
        self.df_movies_movies_similarity_matrix = None

    def __str__(self) -> str:
        return (
            'df_users:\n' + str(self.df_users) + '\n'
            + 'df_movies:\n' + str(self.df_movies) + '\n'
            + 'df_ratings:\n' + str(self.df_ratings) + '\n'
            + 'df_genres:\n' + str(self.df_genres) + '\n'
            + 'df_movies_genres:\n' + str(self.df_movies_genres)
        )

    def to_rating_matrix(self, rating_matrix_csv: str) -> None:
        """データセットを基に評価値行列を作成する。

        Parameters
        ----------
        rating_matrix_csv : str
            評価値行列の出力先CSVファイル名
        """
        # 評価値行列を作成する。
        df_rating_matrix = pd.DataFrame(index=self.user_ids, columns=self.movie_ids)

        # 評価値行列の要素を入力する。
        for tuple_ in tqdm(self.df_ratings.itertuples(), total=len(self.df_ratings), desc='processing Dataset.to_rating_matrix'):
            df_rating_matrix.loc[tuple_.user_id, tuple_.movie_id] = tuple_.rating

        # 評価値行列をCSVファイルに出力する。
        df_rating_matrix.to_csv(self.data_path / rating_matrix_csv, index=True, header=True, sep='\t')

    def read_rating_matrix(self, rating_matrix_csv: str) -> None:
        """評価値行列を読み込む。

        Parameters
        ----------
        rating_matrix_csv : str
            評価値行列のCSVファイル名
        """
        if self.df_rating_matrix is not None: return
        # 評価値行列を読み込む。
        self.df_rating_matrix = pd.read_csv(self.data_path / rating_matrix_csv, index_col=0, header=0, sep='\t')

    def to_movies_movies_similarity_matrix(self, movies_movies_similarity_matrix_csv: str) -> None:
        """データセットを基に映画-映画類似度行列を作成する。

        Parameters
        ----------
        movies_movies_similarity_matrix_csv : str
            映画-映画類似度行列の出力先CSVファイル名
        """

        def adjusted_cos(i: int, j: int) -> float:
            """評価値行列R2における映画iと映画jの調整コサイン類似度を返す。

            Parameters
            ----------
            i : int
                映画iのID
            j : int
                映画jのID

            Returns
            -------
            cosine : float
                調整コサイン類似度
            """
            Uij = np.intersect1d(Ui[i], Ui[j])
            if Uij.size <= 0: return 0.0

            num = np.sum([R2[u, i] * R2[u, j] for u in Uij])
            den_i = np.sqrt(np.sum([R2[u, i] ** 2 for u in Uij]))
            den_j = np.sqrt(np.sum([R2[u, j] ** 2 for u in Uij]))
            cosine = num / (den_i * den_j)
            return cosine

        def sim(i: int, j: int) -> float:
            """映画類似度関数：映画iと映画jの映画類似度を返す。

            Parameters
            ----------
            i : int
                映画iのID
            j : int
                映画jのID

            Returns
            -------
            float
                アイテム類似度
            """
            return adjusted_cos(i, j)

        _, _, I, Ui, _, R2, _ = self.load()
        S = np.array([[sim(i, j) for j in I] for i in tqdm(I, desc='processing Dataset.to_movies_movies_similarity_matrix')])
        df_movies_movies_similarity_matrix = pd.DataFrame(S, index=self.movie_ids, columns=self.movie_ids)
        df_movies_movies_similarity_matrix.to_csv(self.data_path / movies_movies_similarity_matrix_csv, index=True, header=True, sep='\t')

    def read_movies_movies_similarity_matrix(self, movies_movies_similarity_matrix_csv: str) -> None:
        """映画-映画類似度行列を読み込む。

        Parameters
        ----------
        movies_movies_similarity_matrix_csv : str
            映画-映画類似度行列のCSVファイル名
        """
        if self.df_movies_movies_similarity_matrix is not None: return
        # 映画-映画類似度行列を読み込む。
        self.df_movies_movies_similarity_matrix = pd.read_csv(self.data_path / movies_movies_similarity_matrix_csv, index_col=0, header=0, sep='\t')


    def to_atomic(self, dataset_name: str) -> None:
        """データセットをRecBole用のAtmic File形式に変換して保存する。

        Parameters
        ----------
        dataset_name : str
            データセット名

        References:
            Atomic Files — RecBole 1.2.1 documentation, https://recbole.io/docs/user_guide/data/atomic_files.html
        """

        def get_genres(movie_id: int) -> str:
            """対象映画のジャンルIDリストをスペース区切りの文字列にして返す。

            Parameters
            ----------
            movie_id : int
                映画ID

            Returns
            -------
            str
                ジャンルIDリスト
            """
            genre_ids = list(self.df_movies_genres.query('movie_id==@movie_id')['genre_id'])
            genre_names = [self.df_genres.query('id==@genre_id')['name'].values[0] for genre_id in genre_ids]
            genres = ' '.join(genre_names)
            return genres

        # 評価値データフレームを作成する。
        df_inter = self.df_ratings.loc[:, ['user_id', 'movie_id', 'rating', 'rated_at']]
        df_inter = df_inter.rename(
            columns={
                'user_id': 'user_id:token',
                'movie_id': 'movie_id:token',
                'rating': 'rating:float',
                'rated_at': 'rated_at:token',
            }
        )
        
        # ユーザデータフレームを作成する。
        df_user = self.df_users.rename(
            columns={
                'id': 'user_id:token',
                'email_encrypted': 'email_encrypted:token',
                'email_hash': 'email_hash:token',
            }
        )
        
        # アイテムデータフレームを作成する。
        rows = []
        for movie in self.df_movies.itertuples():
            genres = get_genres(movie.id)
            rows.append([movie.id, movie.title, movie.year, movie.imdb_id, movie.tmdb_id, genres])
        df_item = pd.DataFrame(rows, columns=['movie_id:token', 'title:token_seq', 'year:token', 'imbd_id:token', 'tmdb_id:token', 'genres:token_seq'])

        # 各データを出力する。
        df_inter.to_csv(self.data_path / (dataset_name + '.inter'), index=False, header=True, sep='\t')
        df_user.to_csv(self.data_path / (dataset_name + '.user'), index=False, header=True, sep='\t')
        df_item.to_csv(self.data_path / (dataset_name + '.item'), index=False, header=True, sep='\t')

    def load(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray, list[np.ndarray], list[np.ndarray], np.ndarray, np.ndarray]:
      """各データを変数として返す。

      Returns
      -------
      R : np.ndarray
          評価値行列
      U : np.ndarray
          ユーザ集合
      I : np.ndarray
          映画集合
      Ui : list[np.ndarray]
          映画iを評価済みのユーザ集合
      Iu : list[np.ndarray]
          ユーザuが評価済みの映画集合
      R2 : np.ndarray
          平均中心化評価値行列
      S : np.ndarray
          映画-映画類似度行列
      """
      R = np.array(self.df_rating_matrix)
      U = np.arange(R.shape[0])
      I = np.arange(R.shape[1])
      Ui = [U[~np.isnan(R)[:, i]] for i in I]
      Iu = [I[~np.isnan(R)[u, :]] for u in U]
      ru_mean = np.nanmean(R, axis=1)
      # ri_mean = np.nanmean(R, axis=0)
      R2 = R - ru_mean.reshape((ru_mean.size, 1))
      S = np.array(self.df_movies_movies_similarity_matrix)
      return R, U, I, Ui, Iu, R2, S
    

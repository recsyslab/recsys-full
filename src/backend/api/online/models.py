from django.db import models
from django.contrib.postgres.indexes import GinIndex 
from .utils import encrypt, hash, decrypt, mask_email
import uuid


class User(models.Model):
    """
    ユーザモデル

    Attributes
    ----------
    user_id : UUIDField
        ユーザID
    email_encrypted : TextField
        暗号化emailアドレス
    email_hash : CharField
        emailアドレスのハッシュ値
    """
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email_encrypted = models.TextField(blank=False, null=False, unique=True)
    email_hash = models.CharField(blank=False, null=False, unique=True, max_length=64)  # SHA256は64文字

    class Meta:
        managed = True
        db_table = 't_users'

    def set_email(self, email):
        """emailを暗号化 & ハッシュ化して保存"""
        self.email_encrypted = encrypt(email)
        self.email_hash = hash(email)

    def get_email(self):
        """暗号化されたemailを復号"""
        return decrypt(self.email_encrypted)

    def masked_email(self):
        """マスクされたメール表示"""
        try:
            email = self.get_email()
            return mask_email(email)
        except Exception:
            return None

    def __str__(self):
        return f'User {self.user_id}: {self.get_email()}'


class Movie(models.Model):
    """
    映画モデル

    Attributes
    ----------
    movie_id : IntegerField
        映画ID
    title : TextField
        タイトル
    year : IntegerField
        公開年
    genres : ManyToManyField[Genre]
        ジャンルリスト
    imdb_id: IntegerField
        IMDb ID
    tmdb_id: IntegerField
        TMDB ID
    """
    movie_id = models.IntegerField(primary_key=True)
    title = models.TextField(blank=False, null=False)
    year = models.IntegerField(blank=True, null=True)
    imdb_id = models.IntegerField(blank=True, null=True)
    tmdb_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'm_movies'
        indexes = [
            GinIndex(fields=['title'], name='movie_title_gin', opclasses=['gin_trgm_ops']),
        ]

    def __str__(self):
        return f'Movie {self.movie_id}: {self.title}'


class Genre(models.Model):
    """
    ジャンルモデル

    Attributes
    ----------
    genre_id : IntegerField
        ジャンルID
    genre_name : TextField
        ジャンル名
    """
    genre_id = models.IntegerField(primary_key=True)
    genre_name = models.TextField(blank=False, null=False)

    class Meta:
        managed = True
        db_table = 'm_genres'

    def __str__(self):
        return f'Genre {self.genre_id}: {self.genre_name}'


class MovieGenre(models.Model):
    """
    映画-ジャンル中間モデル

    Attributes
    ----------
    id : CharField
        ID
    movie : ForeignKey[Movie]
        映画
    genre : ForeignKey[Genre]
        ジャンル
    """
    id = models.CharField(primary_key=True, max_length=9)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_genres')
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='genre_movies')

    class Meta:
        managed = True
        db_table = 'm_movies_genres'

    def __str__(self):
        return f'MovieGenre {self.id}: Movie {self.movie.title} - Genre {self.genre.genre_name}'

    
class UserMovieRating(models.Model):
    """
    ユーザ-映画中間モデル（評価値）

    Attributes
    ----------
    id : CharField
        ID
    user : ForeignKey[User]
        ユーザ
    movie : ForeignKey[Movie]
        映画
    rating : FloatField
        評価値
    rated_at : DateTimeField
        評価日時（自動更新）
    """
    id = models.CharField(primary_key=True, max_length=43)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_movies')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_users')
    rating = models.FloatField(blank=False, null=False)
    rated_at = models.DateTimeField(blank=False, null=False, auto_now=True)

    class Meta:
        managed = True
        db_table = 't_users_movies_rating'
        indexes = [
            models.Index(fields=['user', 'rating', '-rated_at'], name='umr_user_rating_idx'),
            models.Index(fields=['user', 'movie'], name='umr_user_movie_idx'),
        ]

    def __str__(self):
        return f'UserMovieRating {self.id}: User {self.user.user_id} - Movie {self.movie.movie_id}: {self.rating}'


class ReclistPopularity(models.Model):
    """
    人気ベース推薦システムによる推薦リストモデル

    Attributes
    ----------
    id : CharField
        推薦リストID
    target_genre : ForeignKey[Genre]
        対象ジャンル
    rank : IntegerField
        推薦順位
    movie : ForeignKey[Movie]
        推薦映画
    score : FloatField
        推薦スコア
    """
    id = models.CharField(primary_key=True, max_length=5)
    target_genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    rank = models.IntegerField(blank=False, null=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        managed = True
        db_table = 'r_reclist_popularity'

    def __str__(self):
        return f'ReclistPopularity {self.id}: Genre {self.target_genre.genre_name} - RecMovie {self.rank}: {self.movie.title}'


class ReclistMovieSimilarity(models.Model):
    """
    映画類似度ベース推薦システムによる推薦リストモデル

    Attributes
    ----------
    id : CharField
        推薦リストID
    base_movie : ForeignKey[Movie]
        ベース映画
    rank : IntegerField
        推薦順位
    movie : ForeignKey[Movie]
        推薦映画
    score : FloatField
        推薦スコア
    """
    id = models.CharField(primary_key=True, max_length=9)
    base_movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='base_movie_movies')
    rank = models.IntegerField(blank=False, null=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_base_movies')
    score = models.FloatField()

    class Meta:
        managed = True
        db_table = 'r_reclist_movie_similarity'

    def __str__(self):
        return f'ReclistMovieSimilarity {self.id}: BaseMovie {self.base_movie.title} - RecMovie {self.rank}: {self.movie.title}'


class ReclistBPR(models.Model):
    """
    BPRベース推薦システムによる推薦リストモデル

    Attributes
    ----------
    id : CharField
        推薦リストID
    user : ForeignKey[User]
        対象ユーザ
    rank : IntegerField
        推薦順位
    movie : ForeignKey[Movie]
        推薦映画
    score : FloatField
        推薦スコア
    """
    id = models.CharField(primary_key=True, max_length=39)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rank = models.IntegerField(blank=False, null=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        managed = True
        db_table = 'r_reclist_bpr'

    def __str__(self):
        return f'ReclistBPR {self.id}: User  {self.user.user_id} - RecMovie {self.rank}: {self.movie.title}'


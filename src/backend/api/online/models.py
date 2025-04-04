from django.db import models
from .utils import encrypt, hash, decrypt
import uuid


class User(models.Model):
    """ユーザモデル

    Attributes
    ----------
    id : UUIDField
        ユーザID
    email_encrypted : TextField
        暗号化emailアドレス
    email_hash : CharField
        emailアドレスのハッシュ値
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email_encrypted = models.TextField(blank=False, null=False, unique=True)
    email_hash = models.CharField(max_length=64, blank=False, null=False, unique=True)  # SHA256は64文字

    class Meta:
        managed = True
        db_table = 'users'

    def set_email(self, email):
        """emailを暗号化 & ハッシュ化して保存"""
        self.email_encrypted = encrypt(email)
        self.email_hash = hash(email)

    def get_email(self):
        """暗号化されたemailを復号"""
        return decrypt(self.email_encrypted)

    def __str__(self):
        return '{}:{}:{}'.format(self.id, self.email_encrypted, self.email_hash)
    

class Genre(models.Model):
    """ジャンルモデル

    Attributes
    ----------
    id : IntegerField
        ジャンルID
    name : TextField
        ジャンル名
    """
    id = models.IntegerField(primary_key=True)
    name = models.TextField(blank=False, null=False)

    class Meta:
        managed = True
        db_table = 'genres'

    def __str__(self):
        return '{}:{}'.format(self.id, self.name)


class Movie(models.Model):
    """映画モデル

    Attributes
    ----------
    id : IntegerField
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
    id = models.IntegerField(primary_key=True)
    title = models.TextField(blank=False, null=False)
    year = models.IntegerField(blank=True, null=True)
    genres = models.ManyToManyField(Genre)
    imdb_id = models.IntegerField(blank=True, null=True)
    tmdb_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'movies'

    def __str__(self):
        return '{}:{}({})'.format(self.id, self.title, self.year)
    

class Rating(models.Model):
    """評価値モデル

    Attributes
    ----------
    id : TextField
        評価値ID
    user : ForeignKey[User]
        対象ユーザ
    movie : ForeignKey[Movie]
        対象映画
    rating : IntegerField
        評価値
    """
    id = models.TextField(primary_key=True, max_length=43)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, related_name='movie_ratings', on_delete=models.CASCADE)
    rating = models.FloatField(blank=False, null=False)
    rated_at = models.DateTimeField(blank=False, null=False, auto_now=True)

    class Meta:
        managed = True
        db_table = 'ratings'

    def __str__(self):
        return '{}:{}:{}'.format(self.user.id, self.movie.id, self.rating)
    

class ReclistPopularity(models.Model):
    """人気ベース推薦システムによる推薦リストモデル

    Attributes
    ----------
    id : IntegerField
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
    id = models.TextField(primary_key=True, max_length=5)
    target_genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    rank = models.IntegerField(blank=False, null=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        managed = True
        db_table = 'reclist_popularity'

    def __str__(self):
        return '{}:{}:{}({})'.format(self.target_genre.id, self.rank, self.movie.id, self.score)
    

class ReclistMoviesMovies(models.Model):
    """映画-映画類似度ベース推薦システムによる推薦リストモデル

    Attributes
    ----------
    id : IntegerField
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
    id = models.TextField(primary_key=True, max_length=5)
    base_movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='base_movie_movies')
    rank = models.IntegerField(blank=False, null=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='movie_movies')
    score = models.FloatField()

    class Meta:
        managed = True
        db_table = 'reclist_movies_movies'

    def __str__(self):
        return '{}:{}:{}({})'.format(self.base_movie.id, self.rank, self.movie.id, self.score)
    

class ReclistBPR(models.Model):
    """BPRベース推薦システムによる推薦リストモデル

    Attributes
    ----------
    id : IntegerField
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
    id = models.TextField(primary_key=True, max_length=5)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rank = models.IntegerField(blank=False, null=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        managed = True
        db_table = 'reclist_bpr'

    def __str__(self):
        return '{}:{}:{}({})'.format(self.user.id, self.rank, self.movie.id, self.score)
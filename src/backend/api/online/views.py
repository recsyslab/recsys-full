from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Movie, Rating
from .models import ReclistPopularity, ReclistMoviesMovies, ReclistBPR
from .mappers import UserMapper, MovieMapper, RatingMapper
from .utils import hash
import uuid
from django.db.models import Prefetch


class UsersView(APIView):
    """ユーザビュークラス
    """
    def get(self, request, format=None):
        """ユーザを取得する。
        
        Requests
        --------
        email : str
            emailアドレス

        Response
        --------
        user : json
            ユーザ
        """
        # リクエストパラメタの取得
        email = request.GET.get('email')
        if not email:
            return Response(None, status.HTTP_401_UNAUTHORIZED)
        email_hash = hash(email)
        
        # オブジェクトの取得
        users = User.objects.filter(email_hash=email_hash)

        # レスポンス
        users_dict = [UserMapper(user).as_dict() for user in users]
        data = {
            'users': users_dict,
        }
        return Response(data, status.HTTP_200_OK)

    def post(self, request, format=None):
        """ユーザを登録する。

        Requests
        --------
        email : str
            emailアドレス

        Response
        --------
        user : json
            ユーザ
        """
        # リクエストパラメタの取得
        email = request.data['email']

        # オブジェクトの登録
        id = str(uuid.uuid4())
        user = User(id=id)
        user.set_email(email)
        user.save()

        # レスポンス
        user_dict = UserMapper(user).as_dict()
        data = {
            'user': user_dict,
        }
        return Response(data, status.HTTP_201_CREATED)
    

class MoviesView(APIView):
    """映画リストビュークラス
    """
    def get(self, request, format=None):
        """映画リストを取得する。

        Response
        --------
        movies : json
            映画リスト
        """
        # ユーザ認証
        user_id = request.GET.get('user_id') if 'user_id' in request.GET else None
        
        # オブジェクトの取得
        movies = []
        if user_id:
            movies = Movie.objects.order_by('?')[:20]\
                .prefetch_related('genres')\
                .prefetch_related(
                    Prefetch(
                        'movie_ratings',
                        queryset=Rating.objects.filter(user_id=user_id),
                        to_attr='user_ratings'
                    )
                )
        else:
            movies = Movie.objects.order_by('?')[:20].prefetch_related('genres')
        
        # レスポンス
        movies_dict = [MovieMapper(movie).as_dict(user_id) for movie in movies]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)
    

class MovieView(APIView):
    """映画ビュークラス
    """
    def get(self, request, id, format=None):
        """映画を取得する。
        
        Attributes
        ----------
        id : int
            映画ID

        Response
        --------
        movie : json
            映画
        """
        # ユーザ認証
        user_id = request.GET.get('user_id') if 'user_id' in request.GET else None
        
        # オブジェクトの取得
        movie = None
        if user_id:
            movie = Movie.objects.filter(id=id)\
                .prefetch_related('genres')\
                .prefetch_related(
                    Prefetch(
                        'movie_ratings',
                        queryset=Rating.objects.filter(user_id=user_id),
                        to_attr='user_ratings'
                    )
                ).first()
        else:
            movie = Movie.objects.get(pk=id)

        # レスポンス
        movie_dict = MovieMapper(movie).as_dict(user_id)
        data = {
            'movie': movie_dict,
        }
        return Response(data, status.HTTP_200_OK)
    

class RatingsView(APIView):
    """評価値ビュークラス
    """
    def get(self, request, format=None):
        """評価値を取得する。

        Requests
        --------
        id : str
            評価値ID

        Response
        --------
        ratings : json
            評価値リスト
        """
        # リクエストパラメタの取得
        id = request.GET.get('id')

        # オブジェクトの取得
        ratings = Rating.objects.filter(id=id)

        # レスポンス
        ratings_dict = [RatingMapper(rating).as_dict() for rating in ratings]
        data = {
            'ratings': ratings_dict,
        }
        return Response(data, status.HTTP_200_OK)
    
    def post(self, request, format=None):
        """評価値を登録する。

        Requests
        --------
        id : str
            評価値ID
        user_id : str
            ユーザID
        movie_id : int
            映画ID
        rating : float
            評価値

        Response
        --------
        rating : json
            評価値
        """
        # リクエストパラメタの取得
        id = request.data['id']
        user_id = request.data['user_id']
        movie_id = request.data['movie_id']
        rating = request.data['rating']

        # オブジェクトの登録
        user = User.objects.get(pk=user_id)
        movie = Movie.objects.get(pk=movie_id)
        rating_model = Rating(id=id, user=user, movie=movie, rating=rating)
        rating_model.save()

        # レスポンス
        rating_dict = RatingMapper(rating_model).as_dict()
        data = {
            'rating': rating_dict,
        }
        return Response(data, status.HTTP_201_CREATED)
    
    def delete(self, request, format=None):
        """評価値を削除する。

        Requests
        --------
        id : str
            評価値ID

        Response
        --------
        rating : json
            評価値
        """
        # リクエストパラメタの取得
        id = request.data['id']

        # オブジェクトの削除
        rating_model = Rating.objects.get(pk=id)
        rating_model.delete()

        # レスポンス
        rating_dict = RatingMapper(rating_model).as_dict()
        data = {
            'rating': rating_dict,
        }
        return Response(data, status.HTTP_200_OK)
        

class MoviesPopularityView(APIView):
    """人気ベース推薦システムによる映画リストビュークラス
    """
    def get(self, request, format=None):
        """対象ジャンルの人気ベース推薦リストを取得する。

        Requests
        --------
        target_genre_id : int
            対象ジャンルID
        user_id : str
            ユーザID

        Response
        --------
        movies : json
            映画リスト
        """
        # ユーザ認証
        user_id = request.GET.get('user_id') if 'user_id' in request.GET else None

        # リクエストパラメタの取得
        target_genre_id = request.GET.get('target_genre_id')

        # オブジェクトの取得
        reclist = []
        if user_id:
            reclist = ReclistPopularity.objects.filter(target_genre_id=target_genre_id)\
                .select_related('movie')\
                .prefetch_related('movie__genres')\
                .prefetch_related(
                    Prefetch(
                        'movie__movie_ratings',
                        queryset=Rating.objects.filter(user_id=user_id),
                        to_attr='user_ratings',
                    )
                )
        else:
            reclist = ReclistPopularity.objects.filter(target_genre_id=target_genre_id)\
                .select_related('movie')\
                .prefetch_related('movie__genres')

        # レスポンス
        movies = [rec.movie for rec in reclist]
        movies_dict = [MovieMapper(movie).as_dict(user_id) for movie in movies]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)
    

class MoviesMoviesMoviesView(APIView):
    """映画-映画類似度ベース推薦システムによる推薦リストビュークラス
    """
    def get(self, request, format=None):
        """ベース映画とのアイテム類似度に基づく推薦リストを取得する。

        Requests
        --------
        base_movie_id : int
            ベース映画ID
        user_id : str
            ユーザID

        Response
        --------
        movies : json
            映画リスト
        """
        # ユーザ認証
        user_id = request.GET.get('user_id') if 'user_id' in request.GET else None

        # リクエストパラメタの取得
        base_movie_id = request.GET.get('base_movie_id')

        # オブジェクトの取得
        reclist = []
        if user_id:
            reclist = ReclistMoviesMovies.objects.filter(base_movie_id=base_movie_id)\
                .select_related('movie')\
                .prefetch_related('movie__genres')\
                .prefetch_related(
                    Prefetch(
                        'movie__movie_ratings',
                        queryset=Rating.objects.filter(user_id=user_id),
                        to_attr='user_ratings',
                    )
                )
        else:
            reclist = ReclistMoviesMovies.objects.filter(base_movie_id=base_movie_id)\
                .select_related('movie')\
                .prefetch_related('movie__genres')

        # レスポンス
        movies = [rec.movie for rec in reclist]
        movies_dict = [MovieMapper(movie).as_dict(user_id) for movie in movies]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)
    

class MoviesBPRView(APIView):
    """BPRベース推薦システムによる推薦リストビュークラス
    """
    def get(self, request, format=None):
        """BPRベース推薦システムによる推薦リストを取得する。

        Requests
        --------
        user_id : str
            ユーザID

        Response
        --------
        movies : json
            映画リスト
        """
        # ユーザ認証
        user_id = request.GET.get('user_id') if 'user_id' in request.GET else None

        # オブジェクトの取得
        reclist = []
        if user_id:
            reclist = ReclistBPR.objects.filter(user_id=user_id)\
                .select_related('movie')\
                .prefetch_related('movie__genres')\
                .prefetch_related(
                    Prefetch(
                        'movie__movie_ratings',
                        queryset=Rating.objects.filter(user_id=user_id),
                        to_attr='user_ratings',
                    )
                )

        # レスポンス
        movies = [rec.movie for rec in reclist]
        movies_dict = [MovieMapper(movie).as_dict(user_id) for movie in movies]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)
    

class MoviesRatedView(APIView):
    """評価済み映画リストビュークラス
    """
    def get(self, request, format=None):
        """対象ユーザの評価済み映画リストを取得する。
        Requests
        --------
        user_id : str
            ユーザID
 
        Response
        --------
        user : json
            ユーザ
        movies : json
            映画リスト
        """
        # ユーザ認証
        user_id = request.GET.get('user_id') if 'user_id' in request.GET else None

        # オブジェクトの取得
        reclist = []
        if user_id:
            reclist = Rating.objects.filter(user_id=user_id).order_by('-rated_at')\
                .select_related('movie', 'user')\
                .prefetch_related('movie__genres')\
                .prefetch_related(
                    Prefetch(
                        'movie__movie_ratings',
                        queryset=Rating.objects.filter(user_id=user_id),
                        to_attr='user_ratings'
                    )
                )
            
        user = User.objects.get(id=user_id)
        user_dict = UserMapper(user).as_dict()

        # レスポンス
        movies = [rec.movie for rec in reclist]
        movies_dict = [MovieMapper(movie).as_dict(user_id) for movie in movies]
        data = {
            'user': user_dict,
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings
import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Movie, UserMovieRating
from .models import ReclistPopularity, ReclistMovieSimilarity, ReclistBPR
from .mappers import MovieMapper, RatingMapper, OMDbMovieMapper


def _get_user(request):
    """
    認証済みユーザを取得する。

    Attributes
    ----------
    request : HttpRequest
        リクエストオブジェクト

    Returns
    -------
    User or None
        認証されたユーザオブジェクト、または認証されていない場合は None
    """
    if getattr(request, 'user', None) and request.user.is_authenticated:
        return getattr(request.user, 'user', None)
    return None


class MoviesView(APIView):
    """映画リストビュー"""
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        映画リストを取得する。

        Responses
        ---------
        movies : json
            映画リスト
        """
        # ユーザ認証
        user = _get_user(request)

        # オブジェクトの取得
        movies = Movie.objects.order_by('?')[:20]\
            .prefetch_related('movie_genres__genre')
        # movies = Movie.objects.all()[:20]\
        #     .prefetch_related('movie_genres__genre')
        
        rating_map = {}
        if user:
            rating_map = {
                rating.movie_id: rating for rating in UserMovieRating.objects.filter(user=user)
            }

        # レスポンス
        movies_dict = [
            MovieMapper(
                movie,
                rating=rating_map.get(movie.movie_id)
            ).as_dict() for movie in movies
        ]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)


class MovieView(APIView):
    """映画ビュー"""
    permission_classes = (AllowAny,)

    def get(self, request, movie_id, format=None):
        """
        映画オブジェクトを取得する。

        Attributes
        ----------
        movie_id : int
            映画ID

        Responses
        ---------
        movie : json
            映画オブジェクト
        """
        # ユーザ認証
        user = _get_user(request)

        # オブジェクトの取得
        movie = get_object_or_404(
            Movie.objects.prefetch_related('movie_genres__genre'),
            pk=movie_id,
        )

        rating_map = {}
        if user:
            rating_map = {
                rating.movie_id: rating for rating in UserMovieRating.objects.filter(user=user)
            }

        # レスポンス
        data = {
            'movie': MovieMapper(
                movie,
                rating=rating_map.get(movie.movie_id),
            ).as_dict() if movie else None,
        }

        return Response(data, status.HTTP_200_OK)

    
class RatingView(APIView):
    """評価値ビュー"""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        対象ユーザの対象映画に対する評価値を取得する。

        Requests
        --------
        user : User
            ユーザ
        movie_id : int
            映画ID

        Response
        --------
        rating : json
            評価値オブジェクト
        """
        # ユーザ認証
        user = _get_user(request)
        if user is None:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # リクエストパラメタの取得
        movie_id = request.GET.get('movie_id')

        # オブジェクトの取得
        movie = get_object_or_404(Movie, pk=movie_id)
        rating = UserMovieRating.objects.filter(user=user, movie=movie).first()

        # レスポンス
        data = {}
        if rating:
            data = {
                'rating': RatingMapper(rating).as_dict(),
            }
        else:
            data = {
                'rating': None
            }

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        """
        対象ユーザの対象映画に対する評価値を登録する。

        Requests
        --------
        user : User
            ユーザ
        movie_id : int
            映画ID
        rating : float
            評価値
        """
        # ユーザ認証
        user = _get_user(request)
        if user is None:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # リクエストパラメタの取得
        movie_id = request.data['movie_id']
        rating = request.data['rating']

        # オブジェクトの登録
        with transaction.atomic():
            id = f'{str(user.user_id)}_{str(movie_id).zfill(6)}'
            movie = get_object_or_404(Movie, pk=movie_id)
            UserMovieRating.objects.update_or_create(
                id=id,
                defaults={'user': user, 'movie': movie, 'rating': rating},
            )

        # レスポンス
        return Response({'detail': 'Created.'}, status.HTTP_201_CREATED)
    
    def delete(self, request, format=None):
        """
        対象ユーザの対象映画に対する評価値を削除する。

        Requests
        --------
        user : User
            ユーザ
        movie_id : int
            映画ID
        """
        # ユーザ認証
        user = _get_user(request)
        if user is None:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # リクエストパラメタの取得
        movie_id = request.data['movie_id']

        # オブジェクトの削除
        with transaction.atomic():
            movie = get_object_or_404(Movie, pk=movie_id)
            rating = UserMovieRating.objects.filter(user=user, movie=movie).first()
            rating.delete() if rating else None

        # レスポンス
        return Response({'detail': 'Deleted.'}, status.HTTP_200_OK)


class MoviesPopularityView(APIView):
    """人気ベース推薦システムによる映画リストビュー"""
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        対象ジャンルの人気ベース推薦リストを取得する。

        Requests
        --------
        user : User
            ユーザ
        target_genre_id : int
            対象ジャンルID

        Responses
        ---------
        movies : json
            推薦映画リスト
        """
        # ユーザ認証
        user = _get_user(request)

        # リクエストパラメタの取得
        target_genre_id = request.GET.get('target_genre_id')

        # オブジェクトの取得
        movies = ReclistPopularity.objects\
            .select_related('movie')\
            .prefetch_related('movie__movie_genres__genre')\
            .filter(target_genre_id=target_genre_id)

        rating_map = {}
        if user:
            rating_map = {
                rating.movie_id: rating for rating in UserMovieRating.objects.filter(user=user)
            }

        # レスポンス
        movies_dict = [
            MovieMapper(
                reclist.movie,
                rating=rating_map.get(reclist.movie_id)
            ).as_dict() for reclist in movies
        ]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)


class MoviesMovieSimilarityView(APIView):
    """映画類似度ベース推薦システムによる映画リストビュー"""
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        ベース映画に対する映画類似度ベース推薦リストを取得する。

        Requests
        --------
        user : User
            ユーザ
        base_movie_id : int
            ベース映画ID

        Responses
        ---------
        movies : json
            推薦映画リスト
        """
        # ユーザ認証
        user = _get_user(request)

        # リクエストパラメタの取得
        base_movie_id = request.GET.get('base_movie_id')

        # オブジェクトの取得
        movies = ReclistMovieSimilarity.objects\
            .select_related('movie')\
            .prefetch_related('movie__movie_genres__genre')\
            .filter(base_movie_id=base_movie_id)

        rating_map = {}
        if user:
            rating_map = {
                rating.movie_id: rating for rating in UserMovieRating.objects.filter(user=user)
            }

        # レスポンス
        movies_dict = [
            MovieMapper(
                reclist.movie,
                rating=rating_map.get(reclist.movie_id)
            ).as_dict() for reclist in movies
        ]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)


class MoviesBPRView(APIView):
    """BPRベース推薦システムによる映画リストビュー"""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        対象ユーザのBPRベース推薦リストを取得する。

        Requests
        --------
        user : User
            ユーザ

        Responses
        ---------
        movies : json
            推薦映画リスト
        """
        # ユーザ認証
        user = _get_user(request)
        if user is None:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # オブジェクトの取得
        movies = ReclistBPR.objects\
            .select_related('movie')\
            .prefetch_related('movie__movie_genres__genre')\
            .filter(user_id=user.user_id)

        rating_map = {}
        if user:
            rating_map = {
                rating.movie_id: rating for rating in UserMovieRating.objects.filter(user=user)
            }

        # レスポンス
        movies_dict = [
            MovieMapper(
                reclist.movie,
                rating=rating_map.get(reclist.movie_id)
            ).as_dict() for reclist in movies
        ]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)


class MoviesRatedView(APIView):
    """評価済み映画リストビュー"""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        評価済み映画リストを取得する。

        Requests
        --------
        user : User
            ユーザ

        Responses
        ---------
        movies : json
            評価済み映画リスト
        """
        # ユーザ認証
        user = _get_user(request)
        if user is None:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # オブジェクトの取得
        movies = UserMovieRating.objects\
            .select_related('movie')\
            .prefetch_related('movie__movie_genres__genre')\
            .filter(user=user)

        rating_map = {}
        if user:
            rating_map = {
                rating.movie_id: rating for rating in UserMovieRating.objects.filter(user=user)
            }

        # レスポンス
        movies_dict = [
            MovieMapper(
                reclist.movie,
                rating=rating_map.get(reclist.movie_id)
            ).as_dict() for reclist in movies
        ]
        data = {
            'movies': movies_dict,
        }
        return Response(data, status.HTTP_200_OK)


class OMDbMovieView(APIView):
    """OMDb映画ビュー"""
    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        OMDbから映画オブジェクトを取得する。

        Requests
        --------
        movie_id : int
            映画ID

        Response
        --------
        omdbMovie : json
            OMDbから取得した映画オブジェクト
        """
        # リクエストパラメタの取得
        movie_id = request.GET.get('movie_id')

        # オブジェクトの取得
        # 1. ローカルの Movie を取得
        movie = get_object_or_404(
            Movie.objects.prefetch_related('movie_genres__genre'),
            pk=movie_id,
        )

        # 2. 設定から OMDb の URL / KEY を取得
        omdb_api_key = getattr(settings, 'OMDB_API_KEY', None)
        omdb_base_url = getattr(settings, 'OMDB_API_BASE_URL', 'https://www.omdbapi.com/')

        if not omdb_api_key:
            return Response(
                {'detail': 'OMDb API key is not configured on server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. imdb_id（数値） → OMDb 用 IMDb ID 文字列 "tt0xxxxxxx" へ変換
        imdb_id_num = movie.imdb_id
        imdb_id = f'tt{int(imdb_id_num):07d}'

        # 4. OMDb API を叩く
        url = omdb_base_url.rstrip('/') + '/'
        params = {
            'apikey': omdb_api_key,
            'i': imdb_id,
        }

        try:
            resp = requests.get(url, params=params, timeout=5)
            resp.raise_for_status()
        except requests.RequestException as e:
            return Response(
                {'detail': f'Failed to fetch from OMDb: {e}'},
                status=status.HTTP_502_BAD_GATEWAY
            )

        omdb_movie = resp.json()

        # OMDb 側からのエラー（映画が見つからないなど）
        if omdb_movie.get('Response') == 'False':
            return Response(
                {'detail': omdb_movie.get('Error', 'OMDb returned error.')},
                status=status.HTTP_404_NOT_FOUND
            )

        # レスポンス
        data = {
            'omdb_movie': OMDbMovieMapper(
                omdb_movie
            ).as_dict() if omdb_movie else None,
        }
        return Response(data, status.HTTP_200_OK)
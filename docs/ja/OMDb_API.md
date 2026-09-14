---
title: OMDb APIキーの取得
layout: default
---

{% include header.html %}

{% raw %}

# OMDb API

## OMDb API キーの取得

1. 下記から<OMDB_API_KEY>を取得する。
   - **[OMDb API - The Open Movie Database](https://www.omdbapi.com/)**

2. 取得したキーをファイルに保存する。

`src/offline/local/keys`

```txt
ENCRYPTION_KEY=<FERNET_KEY>
OMDB_API_KEY=<OMDB_API_KEY>  # <- 追加
```

## バックエンド

### 設定ファイル

`src/backend/config/settings/development.py`

```py
...（略）...
# ↓追加
OMDB_API_BASE_URL = os.environ.get('OMDB_API_BASE_URL', 'https://www.omdbapi.com/')
OMDB_API_KEY = os.environ.get('OMDB_API_KEY')
# ↑追加
```

### マッパー

`src/backend/api/online/mappers.py`

```py
...（略）...
# ↓追加
class OMDbMovieMapper:
    def __init__(self, obj):
        self.obj = obj

    def as_dict(self):
        movie = self.obj
        return {
            'title': movie.get('Title'),
            'poster': movie.get('Poster'),
            'director': movie.get('Director'),
            'writer': movie.get('Writer'),
            'actors': movie.get('Actors'),
            'plot': movie.get('Plot'),
        }
# ↑追加
```

### ビュー

`src/backend/api/online/views.py`

```py
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings  # <- 追加
import requests                   # <- 追加
...（略）...
from .models import Movie, UserMovieRating
from .models import ReclistPopularity, ReclistMovieSimilarity, ReclistBPR
from .mappers import MovieMapper, RatingMapper, OMDbMovieMapper  # <- OMDbMovieMapperを追加
...（略）...
# ↓追加
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

        # 3. imdb_id（数値） → OMDb 用 IMDb ID 文字列 "ttxxxxxxx" へ変換
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
# ↑追加
```

### URL マッピング

`src/backend/api/online/urls.py`

```py
from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.MoviesView.as_view()),
    path('movies/<int:movie_id>/', views.MovieView.as_view()),
    path('movies/popularity/', views.MoviesPopularityView.as_view()),
    path('movies/movie_similarity/', views.MoviesMovieSimilarityView.as_view()),
    path('movies/bpr/', views.MoviesBPRView.as_view()),
    path('movies/rated/', views.MoviesRatedView.as_view()),
    path('ratings/', views.RatingView.as_view()),
    path('omdb_movie/', views..as_view()),  # <- 追加
]
```

### 実行確認

```bash
(recsys_full) backend$
 export OMDB_API_KEY=<OMDB_API_KEY>
 python manage.py runserver
```

ブラウザで下記 URL にアクセスしてください。

- [http://localhost:8000/api/online/omdb_movie/?movie_id=1](http://localhost:8000/api/online/omdb_movie/?movie_id=1)

OMDb API による映画の詳細情報が取得できます。

## フロントエンド

### データ型

`src/frontend/src/types/data.d.ts`

```ts
...（略）...
/**
 * 映画モデル
 */
export type Movie = {
  movie_id: number;
  title: string;
  year: number;
  genres: Genre[];
  imdb_id: number;
  tmdb_id: number;
  rating: Rating | null;
  omdbMovie?: OMDbMovie; // <- 追加
};

// ↓追加
// OMDb映画モデル
export type OMDbMovie = {
  title: string;
  poster: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
};
// ↑追加
...（略）...
```

### 定数の定義

`src/frontend/src/constants/styles.ts`

```ts
/**
 * スタイル関連の定数
 */
export const STYLES = {
  ...（略）...
  // 映画（詳細）カード関連
  ...（略）...
  MOVIE_DETAIL_TAG_GENRE: `rounded bg-gray-100 px-3 py-1 text-sm`,
  MOVIE_DETAIL_PLOT: `mt-4 text-sm leading-relaxed text-gray-700`, // <- 追加
  MOVIE_DETAIL_STAR_WIDTH: 48,
  ...（略）...
} as const;
```

### API

`src/frontend/src/api/omdb/getOMDbMovie.ts`

```ts
import { ApiContext, OMDbMovie } from "@/types/data";
import { fetcher } from "@/utils";

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画取得API
 * @param movieId - 映画ID
 * @returns omdbMovie - OMDbによる映画オブジェクト
 */
const getOMDbMovie = async (
  movieId: number,
): Promise<{ omdbMovie: OMDbMovie }> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, "")}/online/omdb_movie/?movie_id=${movieId}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const res = await fetcher(url, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  });

  return { omdbMovie: res.omdb_movie };
};

export default getOMDbMovie;
```

### コンポーネント

`src/frontend/src/app/components/ui/card/CardMovie.tsx`

```tsx
...（略）...
/**
 * 映画カードコンポーネント
 */
const CardMovie = (props: Props) => {
  const posterPath = useMemo(() => {
    // ↓修正
    const path =
      props.movie.omdbMovie && props.movie.omdbMovie.poster !== 'N/A'
        ? props.movie.omdbMovie.poster
        : STYLES.MOVIE_POSTER_PATH_DUMMY;
    // ↑修正
    return path;
  }, [props.movie]);
  ...（略）...
};

export default CardMovie;
```

`src/frontend/src/app/components/ui/card/CardMovieDetail.tsx`

```tsx
...（略）...
import { Movie, User } from '@/types/data';
import { MESSAGES, STYLES, ERROR_MESSAGES } from '@/constants';
import getMovie from '@/api/movies/getMovie';
import getMyAccount from '@/api/auth/getMyAccount';
import postRating from '@/api/ratings/postRating';
import getOMDbMovie from '@/api/omdb/getOMDbMovie'; // <- 追加
...（略）...
/**
 * 映画（詳細）カードコンポーネント
 */
const CardMovieDetail = (props: Props) => {
  ...（略）...
  const posterPath = useMemo(() => {
    // ↓修正
    const path =
      movie && movie.omdbMovie && movie.omdbMovie.poster !== 'N/A'
        ? movie.omdbMovie.poster
        : STYLES.MOVIE_POSTER_PATH_DUMMY;
    // ↑修正
    return path;
  }, [movie]);

  useEffect(() => {
    const load = async () => {
      ...（略）...
      try {
        const { movie: movie_ } = await getMovie(props.movieId);
        // ↓追加
        const res = await getOMDbMovie(movie_.movie_id);
        const movieWithOmdb: Movie = {
          ...movie_,
          omdbMovie: res ? res.omdbMovie : undefined,
        };
        // ↑追加
        setMovie(movieWithOmdb);  // <- 修正
      } catch (e) {
        console.error(ERROR_MESSAGES.MOVIE_GET_FAILED, e);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  ...（略）...
  return (
    <div className={`${STYLES.MOVIE_DETAIL_PAGE}`}>
      <article className={`${STYLES.MOVIE_DETAIL_CARD}`} key={movie.movie_id}>
        <h1 className={`${STYLES.MOVIE_DETAIL_TITLE}`}>{movie.title}</h1>
        <div className={`${STYLES.MOVIE_DETAIL_BODY}`}>
          ...（略）...
          <div className={`${STYLES.MOVIE_DETAIL_INFO}`}>
            ...（略）...
            {/* ↓追加 */}
            {movie.omdbMovie?.plot && (
              <div className={`${STYLES.MOVIE_DETAIL_PLOT}`}>{movie.omdbMovie.plot}</div>
            )}
            {/* ↑追加 */}
          </div>
        </div>
        ...（略）...
      </article>
    </div>
  );
};

export default CardMovieDetail;
```

`src/frontend/src/app/components/ui/list/ListMovie.tsx`

```tsx
...（略）...
import { Movie, User } from '@/types/data';
import { STYLES } from '@/constants';
import deleteRating from '@/api/ratings/deleteRating';
import getOMDbMovie from '@/api/omdb/getOMDbMovie'; // <- 追加

import CardMovie from '../card/CardMovie';
import Loading from '../Loading'; // <- 追加
...（略）...
/**
 * 映画リストコンポーネント
 */
const ListMovie = (props: Props) => {
  const [movies, setMovies] = useState<Movie[]>(props.movies);
  const [perPage, setPerPage] = useState<number>(STYLES.LIST_MOVIE_PER_PAGE_DEFAULT);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingOmdb, setLoadingOmdb] = useState(false); // <- 追加
  ...（略）...
  useEffect(() => {
    ...（略）...
  }, [movies, perPage, currentPage]);

  // ↓追加
  useEffect(() => {
    const loadOmdbMovies = async () => {
      if (!props.movies || props.movies.length === 0) {
        setMovies(props.movies);
        return;
      }

      setLoadingOmdb(true);
      try {
        const omdbMovies = await Promise.all(
          props.movies.map(async (movie) => {
            // すでに OMDb 情報があればそのまま
            if (movie.omdbMovie) return movie;

            const res = await getOMDbMovie(movie.movie_id);
            return {
              ...movie,
              omdbMovie: res ? res.omdbMovie : undefined,
            };
          })
        );
        setMovies(omdbMovies);
      } catch (e) {
        console.error('Failed to load OMDb movies:', e);
        // 失敗した場合でも最低限の表示のため props.movies を入れておく
        setMovies(props.movies);
      } finally {
        setLoadingOmdb(false);
      }
    };

    loadOmdbMovies();
  }, [props.movies]);
  // ↑追加
  ...（略）...
  return (
    <>
      <div className={`${STYLES.LIST_MOVIE_LABEL_PHRASE}`}>{props.phrase}</div>
      <div className={`${STYLES.LIST_MOVIE}`}>
        <button
          ...（略）...
        </button>
        {/* ↓修正 */}
        {loadingOmdb ? (
          <div className={`${STYLES.LOADING_INLINE}`}>
            <Loading />
          </div>
        ) : (
          <div ref={containerRef} className={`${STYLES.LIST_MOVIE_INSIDE}`}>
            {currentMovies.map((movie, index) => (
              <CardMovie
                movie={movie}
                user={props.user}
                isMyList={props.isMyList}
                handleRatingClick={handleRatingClick}
                handleDelete={handleDelete}
                key={movie.movie_id}
              />
            ))}
          </div>
        )}
        {/* ↑修正 */}
        <button
          ...（略）...
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </>
  );
};

export default ListMovie;
```

下記それぞれの URL にアクセスしてください。

- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/movies/1](http://localhost:3000/movies/1)
- [http://localhost:3000/mypage](http://localhost:3000/mypage)

ポスター画像が表示されるようになりました。また、映画詳細ページでは、映画のプロットも表示されます。

#### 参考

1. [OMDb API - The Open Movie Database](https://www.omdbapi.com/)
1. [next.js - How to allow all domains for Image nextjs config? - Stack Overflow](https://stackoverflow.com/questions/71235874/how-to-allow-all-domains-for-image-nextjs-config)
1. [【React アプリ開発】3 種類の React アプリケーションを構築して、React の理解をさらに深めるステップアップ講座 \| Udemy](https://www.udemy.com/course/react-3project-app-udemy/)
   - データ読み込み時のローディング設定をしよう

{% endraw %}

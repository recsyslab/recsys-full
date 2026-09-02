---
title: BPRベース推薦システム
layout: default
---

{% include header.html %}

{% raw %}

# BPR ベース推薦システム

## バックエンド

### モデル

`src/backend/api/online/models.py`

```py
...（略）...
# ↓追加
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
        return f'ReclistBPR {self.id}: User {self.user.user_id} - RecMovie {self.rank}: {self.movie.title}'
# ↑追加
```

### マイグレーション

```bash
(recsys_full) backend$ python manage.py makemigrations online
Migrations for 'online':
  api/online/migrations/0006_reclistbpr.py
    + Create model ReclistBPR

(recsys_full) backend$ python manage.py migrate
Operations to perform:
  Apply all migrations: accounts, admin, auth, contenttypes, online, sessions, token_blacklist
Running migrations:
  Applying online.0006_reclistbpr... OK
```

### データの登録

```bash
offline$
 psql recsys_full -U postgres -c "\copy r_reclist_bpr (id, user_id, movie_id, score, rank) from 'data/reclist_bpr.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

### データの確認

```pgsql
recsys_full=#
 SELECT * FROM r_reclist_bpr;
```

### ビュー

`src/backend/api/online/views.py`

```py
...（略）...
from .models import Movie, UserMovieRating
from .models import ReclistPopularity, ReclistMovieSimilarity, ReclistBPR  # <- ReclistBPRを追加
from .mappers import MovieMapper, RatingMapper
...（略）...
# ↓追加
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
    path('movies/bpr/', views.MoviesBPRView.as_view()),  # <- 追加
    path('ratings/', views.RatingView.as_view()),
]
```

### 実行確認

[サインインビューの作成](サインインビューの作成.md)の手順にしたがってサインインし、アクセストークンを取得してください。取得したトークンを用いて、バックエンドサーバが起動している状態で、下記コマンドを実行してください。

```bash
$
 curl -X GET http://localhost:8000/api/online/movies/bpr/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

BPR ベース推薦システムは個人化推薦システムであるので、ユーザ認証されていない場合は推薦リストが生成されません。また、現時点では、新規ユーザに対してモデルの更新を行っていないため、新規ユーザで認証した場合は推薦リストは空になります。

## フロントエンド

### 定数の定義

`src/frontend/src/constants/styles.ts`

```ts
/**
 * スタイル関連の定数
 */
export const STYLES = {
  ...（略）...
  // 映画類似度ベース映画推薦リスト関連
  LIST_MOVIE_MOVIE_SIMILARITY_PHRASE: 'この映画が好きな人はこんな映画も好んでいます',

  // ↓追加
  // BPRベース映画推薦リスト関連
  LIST_MOVIE_BPR_PHRASE: 'あなたにおすすめの映画',
  // ↑追加
  ...（略）...
} as const;
```

### API

`src/frontend/src/api/movies/getMoviesBPR.ts`

```ts
import { ApiContext, Movie } from "@/types/data";
import { fetcher } from "@/utils";

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * BPRベース推薦システムによる推薦映画リスト取得API
 * @returns movies - 推薦映画リスト
 */
const getMoviesBPR = async (): Promise<{ movies: Movie[] }> => {
  const access =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const url = `${context.apiRootUrl?.replace(/\/$/g, "")}/online/movies/bpr/`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };

  return await fetcher(url, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  });
};

export default getMoviesBPR;
```

### コンポーネント

`src/frontend/src/app/components/ui/list/ListMovieBPR.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

import { Movie, User } from "@/types/data";
import { STYLES, ERROR_MESSAGES } from "@/constants";
import getMoviesBPR from "@/api/movies/getMoviesBPR";
import getMyAccount from "@/api/auth/getMyAccount";

import ListMovie from "./ListMovie";
import Loading from "../Loading";

/**
 * BPRベース推薦システムによる推薦映画リストコンポーネント
 */
const ListMovieBPR = () => {
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const phrase = STYLES.LIST_MOVIE_BPR_PHRASE;

  useEffect(() => {
    const load = async () => {
      try {
        const user_ = await getMyAccount();
        setUser(user_);
      } catch (e) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }

      try {
        const { movies: movies_ } = await getMoviesBPR();
        setMovies(movies_);
      } catch (e) {
        console.error(ERROR_MESSAGES.MOVIE_GET_FAILED, e);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className={`${STYLES.LOADING_INLINE}`}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <ListMovie
        phrase={phrase}
        user={loadingUser ? null : user}
        movies={movies}
      />
    </>
  );
};

export default ListMovieBPR;
```

### ページ

`src/frontend/src/app/components/Index.tsx`

```tsx
...（略）...
import ListMovieDaily from './ui/list/ListMovieDaily';
import ListMoviePopularitySection from './ui/list/ListMoviePopularitySection';
import ListMovieBPR from './ui/list/ListMovieBPR'; // <- 追加

/**
 * インデックスコンポーネント
 *
 * JWT の有効期限を監視し、タイムアウト時にメイン画面をログアウト状態へ切り替える。
 */
const Index = () => {
  ...（略）...
  return (
    <>
      ...（略）...
        <>
          <div>ようこそ {user?.user_email} さん！</div>
          <ListMovieDaily />
          <ListMovieBPR /> {/* <- 追加 */}
          <ListMoviePopularitySection />
        </>
      )}
    </>
  );
};

export default Index;
```

### 実行確認

ブラウザで下記 URL にアクセスしてください。

- [http://localhost:3000/](http://localhost:3000/)

本来は、サインインした状態で「あなたにおすすめの映画」が表示されますが、現時点では、モデルの更新を行っていないため、推薦リストは空で表示されません。

{% endraw %}

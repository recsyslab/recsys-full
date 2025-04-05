---
title: BPRベース推薦リストの作成
layout: default
---

{% include header.html %}

{% raw %}

# BPRベース推薦リストの作成

## バックエンド

### モデル
`backend/api/online/models.py`
```py
...（略）...
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
```

### マイグレーション
```bash
(recsys_full) backend$ python manage.py makemigrations online --settings config.settings.development
Migrations for 'online':
  api/online/migrations/0006_reclistbpr.py
    + Create model ReclistBPR
(recsys_full) backend$ python manage.py migrate --settings config.settings.development
```

### データの登録
```bash
offline/data$ psql recsys_full -U postgres -c "\copy reclist_bpr (id, user_id, movie_id, score, rank) from 'reclist_bpr.csv' with delimiter E'\t' csv header encoding 'UTF8'"
```

### データの確認
```pgsql
recsys_full=# SELECT * FROM reclist_bpr;
```

### ビュー
`backend/api/online/views.py`
```py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Movie, Rating
from .models import ReclistPopularity, ReclistMoviesMovies, ReclistBPR  # <- ReclistBPRを追加
from .mappers import UserMapper, MovieMapper, RatingMapper
from .utils import hash
import uuid
from django.db.models import Prefetch
...（略）...
# ↓追加
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
# ↑追加
```

### URLマッピング
`backend/api/online/urls.py`
```py
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UsersView.as_view()),
    path('movies/', views.MoviesView.as_view()),
    path('movies/<int:id>/', views.MovieView.as_view()),
    path('ratings/', views.RatingsView.as_view()),
    path('movies_popularity/', views.MoviesPopularityView.as_view()),
    path('movies_movies_movies/', views.MoviesMoviesMoviesView.as_view()),
    path('movies_bpr/', views.MoviesBPRView.as_view()),  # <- 追加
]
```

ブラウザで下記それぞれのURLにアクセスしてください。
- [http://localhost:8000/api/online/movies_bpr/?user_id=00000000-0000-0000-0000-000000000001](http://localhost:8000/api/online/movies_bpr/?user_id=00000000-0000-0000-0000-000000000001)
- [http://localhost:8000/api/online/movies_bpr/](http://localhost:8000/api/online/movies_bpr/)
- [http://localhost:8000/api/online/movies_bpr/?user_id=【ユーザID】](http://localhost:8000/api/online/movies_bpr/?user_id=【ユーザID】)

既存ユーザの`user_id`を変えてアクセスすると、ユーザごとに推薦リストが表示されます。BPRベース推薦システムは個人化推薦システムであるので、ユーザIDを指定しない場合は推薦リストが空になります。また、現時点では、新規ユーザに対してモデルの更新を行っていないため、新規ユーザのユーザIDを指定した場合は推薦リストは空になります。

## フロントエンド

### API
`frontend/src/services/movies/getMoviesBPR.ts`
```ts
import { ApiContext, Movie, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * BPRベース推薦システムによる映画リスト取得API
 * @param user - ユーザ
 * @returns 映画リスト
 */
const getMoviesBPR = async (user: User): Promise<{ movies: Movie[] }> => {
  const userParam = user ? `?user_id=${user.id}` : '';
  return await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/movies_bpr/${userParam}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
};

export default getMoviesBPR;
```

### コンポーネント
`frontend/src/app/components/movie/MovieListBPR.tsx`
```tsx
import { User } from '@/types/data';
import React from 'react';
import MovieList from './MovieList';
import getMoviesBPR from '@/services/movies/getMoviesBPR';

type Props = {
  perPage: number;
  user: User;
};

const MovieListBPR = async (props: Props) => {
  const phrase = 'あなたにおすすめの映画';
  const { movies } = await getMoviesBPR(props.user);

  return (
    <>
      <MovieList phrase={phrase} movies={movies} perPage={props.perPage} user={props.user} />
    </>
  );
};

export default MovieListBPR;
```

### ページ
`frontend/src/app/page.tsx`
```tsx
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import HelloAccount from './components/HelloAccount';
import connectUser from '@/services/users/connectUser';
import MovieList from './components/movie/MovieList';
import getMovies from '@/services/movies/getMovies';
import { auth } from '@/auth';
import getUser from '@/services/users/getUser';
import MovieListPopularity from './components/movie/MovieListPopularity';
import MovieListBPR from './components/movie/MovieListBPR'; // <- 追加
...（略）...
const Index = async () => {
...（略）...
  return (
    <>
      <section>
        <SessionProvider>
          <HelloAccount />
        </SessionProvider>
        <MovieList phrase="本日のおすすめ" movies={movies} perPage={PER_PAGE} user={user!} />
        {session?.user ? <MovieListBPR user={user!} perPage={PER_PAGE} /> : <></>} {/* <- 追加 */}
...（略）...
      </section>
    </>
  );
};

export default Index;
```

ブラウザで下記URLにアクセスしてください。
- [http://localhost:3000/](http://localhost:3000/)

サインインした状態で、「あなたにおすすめの映画」が表示されます。ただし、現時点では、モデルの更新を行っていないため、推薦リストは空になります。サインアウトした状態では、「あなたにおすすめの映画」自体が表示されません。

{% endraw %}

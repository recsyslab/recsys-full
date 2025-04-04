---
title: OMDb APIキーの取得
layout: default
---

{% include header.html %}

{% raw %}

# OMDb API

## OMDb APIキーの取得
1. 下記から【OMDb APIキー】を取得する。
   - **[OMDb API - The Open Movie Database](https://www.omdbapi.com/)**

## フロントエンド

### 環境変数の設定
取得した【OMDb APIキー】を下記に貼り付けてください。
`frontend/.env.local`
```.env
...（略）...
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/online/
NEXT_PUBLIC_OMDB_API_BASE_URL=https://www.omdbapi.com/  # <- 追加
NEXT_PUBLIC_OMDB_API_KEY=【OMDb APIキー】                # <- 追加
```

### データ型
`frontend/src/types/data.d.ts`
```.ts
// API Context
export type ApiContext = {
  apiRootUrl: string | undefined;
};

// ↓追加
// OMDb API Context
export type OMDbApiContext = {
  apiRootUrl: string | undefined;
  apiKey: string | undefined;
};
// ↑追加

// ユーザ
export type User = {
  id: string;
  email: string;
};

// 映画
export type Movie = {
  id: number;
  title: string;
  year: number;
  genres: string[];
  imdb_id: number;
  tmdb_id: number;
  rating: Rating;
  omdbMovie: OMDbMovie | undefined; // <-追加
};

// ↓追加
// OMDb映画
export type OMDbMovie = {
  title: string;
  poster: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
};
// ↑追加

// 評価値
export type Rating = {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  rated_at: string;
};
```

### API
`frontend/src/services/omdbApi/getOMDbMovie.ts`
```ts
import { Movie, OMDbApiContext, OMDbMovie } from '@/types/data';
import { fetcher } from '@/utils';

const context: OMDbApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_OMDB_API_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
};

/**
 * OMDbによる映画取得API
 * @param movie - 映画
 * @returns OMDbによる映画
 */
const getOMDbMovie = async (movie: Movie): Promise<{ omdbMovie: OMDbMovie } | undefined> => {
  if (!context.apiKey) return undefined;

  const imdbId = 'tt0' + String(movie.imdb_id).padStart(7, '0');
  const movie_ = await fetcher(
    `${context.apiRootUrl?.replace(/\/$/g, '')}/?apikey=${context.apiKey}&i=${imdbId}`,
    {
      mode: 'cors',
    }
  );
  const omdbMovie = {
    title: movie_.Title,
    poster: movie_.Poster,
    director: movie_.Director,
    writer: movie_.Writer,
    actors: movie_.Actors,
    plot: movie_.Plot,
  };
  return { omdbMovie };
};

export default getOMDbMovie;
```

### コンポーネント

`frontend/src/app/components/movie/MovieCard.tsx`
```tsx
...（略）...
const MovieCard = (props: Props) => {
  const img_url = props.movie.omdbMovie ? props.movie.omdbMovie.poster : '/img/dummy_poster.png'; // <- 修正
...（略）...
  return (
    <>
      <article className="h-72 w-32 shadow" key={props.movie.id}>
        <Link href={`/movies/${props.movie.id}`} className="hover:opacity-75">
          {/* ↓修正 */}
          <Image
            src={img_url}
            alt=""
            width={120}
            height={180}
            priority={true}
            unoptimized
            onError={(e: any) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = '/img/dummy_poster.png';
            }}
          />
          {/* ↑修正 */}
        </Link>
...（略）...
      </article>
    </>
  );
};

export default MovieCard;
```

`frontend/src/app/components/movie/MovieCardDetail.tsx`
```tsx
...（略）...
const MovieCardDetail = (props: Props) => {
  const img_url = props.movie.omdbMovie ? props.movie.omdbMovie.poster : '/img/dummy_poster.png'; // <- 修正
...（略）...
  return (
    <>
      <article key={props.movie.id}>
        <div className="mx-4 my-4 flex">
          <div className="flex-shrink-0 md:block">
            {/* ↓修正 */}
            <Image
              src={img_url}
              alt=""
              width={150}
              height={224}
              priority={true}
              unoptimized
              onError={(e: any) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/img/dummy_poster.png';
              }}
            />
            {/* ↑修正 */}
          </div>
          <div className="ml-6">
...（略）...
            <div className="text-gray-800">{props.movie.omdbMovie?.plot}</div> {/* <- 追加 */}
          </div>
        </div>
...（略）...
      </article>
    </>
  );
};

export default MovieCardDetail;
```

`frontend/src/app/components/movie/MovieList.tsx`
```tsx
'use client';
import { Movie, User } from '@/types/data';
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import deleteRating from '@/services/ratings/deleteRating';
import getOMDbMovie from '@/services/omdbApi/getOMDbMovie'; // <- 追加
...（略）...
const MovieList = (props: Props) => {
  const [movies, setMovies] = useState<Movie[]>(props.movies);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true); // <- 追加

  useEffect(() => {
...（略）...
  }, [movies, currentPage]);

  // ↓追加
  useEffect(() => {
    const func = async () => {
      const movies_ = await Promise.all(
        movies.map(async (movie) => {
          const movie_ = JSON.parse(JSON.stringify(movie));
          const res = await getOMDbMovie(movie);
          movie_.omdbMovie = res ? res.omdbMovie : undefined;
          return movie_;
        })
      );
      setMovies(movies_);
    };

    setLoading(true);
    func();
    setLoading(false);
  }, [currentPage]);
  // ↑追加
...（略）...
  return (
    <>
      <div className="text-xl font-bold text-gray-800">{props.phrase}</div>
      <div className="mx-4 my-4 flex justify-between">
        <button
...（略）...
        </button>
        {/* ↓修正 */}
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {currentMovies?.map((movie) => (
              <MovieCard
                movie={movie}
                user={props.user}
                isMyList={props.isMyList}
                handleRatingClick={handleRatingClick}
                handleDelete={handleDelete}
                key={movie.id}
              />
            ))}
          </>
        )}
        {/* ↑修正 */}
        <button
...（略）...
        </button>
      </div>
    </>
  );
};

export default MovieList;
```

### ページ
`frontend/src/app/movies/[id]/page.tsx`
```tsx
import MovieCardDetail from '@/app/components/movie/MovieCardDetail';
import MovieListMoviesMovies from '@/app/components/movie/MovieListMoviesMovies';
import { auth } from '@/auth';
import getMovie from '@/services/movies/getMovie';
import getOMDbMovie from '@/services/omdbApi/getOMDbMovie'; // <- 追加
import connectUser from '@/services/users/connectUser';
import getUser from '@/services/users/getUser';

const PER_PAGE = 5;

const Movie = async ({ params }: { params: Promise<{ id: number }> }) => {
  await connectUser();
  const session = await auth();
  const user = session ? await getUser(session?.user?.email!) : null;
  const { id } = await params;
  const movieId = id;
  const { movie } = await getMovie(movieId, user!);
  const res = await getOMDbMovie(movie); // <- 追加
  movie.omdbMovie = res ? res.omdbMovie : undefined; // <- 追加
...（略）...
};

export default Movie;
```

下記それぞれのURLにアクセスしてください。
- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/movies/1](http://localhost:3000/movies/1)
- [http://localhost:3000/mypage](http://localhost:3000/mypage)

ポスター画像が表示されるようになりました。また、映画詳細ページでは、映画のプロットも表示されます。

#### 参考
1. [OMDb API - The Open Movie Database](https://www.omdbapi.com/)
1. [next.js - How to allow all domains for Image nextjs config? - Stack Overflow](https://stackoverflow.com/questions/71235874/how-to-allow-all-domains-for-image-nextjs-config)
1. [【Reactアプリ開発】3種類のReactアプリケーションを構築して、Reactの理解をさらに深めるステップアップ講座 \| Udemy](https://www.udemy.com/course/react-3project-app-udemy/)
   - データ読み込み時のローディング設定をしよう

{% endraw %}

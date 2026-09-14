---
title: 映画APIの実装
layout: default
---

{% include header.html %}

{% raw %}

# 映画 API の実装

## 定数の定義

`src/frontend/src/constants/messages.ts`

```ts
...（略）...
/**
 * エラーメッセージの定数
 */
export const ERROR_MESSAGES = {
  ...（略）...
  // API関連
  API_REQUEST_ERROR: 'APIリクエスト中にエラーが発生しました',
  MOVIE_GET_FAILED: '映画リストの取得に失敗しました。時間をおいて再度お試しください。', // <- 追加
  ...（略）...
} as const;
```

## 映画取得 API

`src/frontend/src/api/movies/getMovies.ts`

```ts
import { ApiContext, Movie } from "@/types/data";
import { fetcher } from "@/utils";

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画リスト取得API
 * @returns movies - 映画リスト
 */
const getMovies = async (): Promise<{ movies: Movie[] }> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, "")}/online/movies/`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return await fetcher(url, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  });
};

export default getMovies;
```

## 本日のおすすめ映画リストコンポーネント

`src/frontend/src/app/components/list/ListMovieDaily.tsx`

```tsx
"use client";

import { useEffect, useState } from "react"; // <- 追加

import { Movie } from "@/types/data"; // <- 追加
import { STYLES, ERROR_MESSAGES } from "@/constants"; // <- ERROR_MESSAGESを追加
import getMovies from "@/api/movies/getMovies"; // <- 追加

import ListMovie from "./ListMovie";

/**
 * 本日のおすすめ映画リストコンポーネント
 */
const ListMovieDaily = () => {
  const [loading, setLoading] = useState(true); // <- 追加
  const [movies, setMovies] = useState<Movie[]>([]); // <- 追加

  const phrase = STYLES.LIST_MOVIE_DAILY_PHRASE;

  // ↓追加
  useEffect(() => {
    const load = async () => {
      try {
        const { movies: movies_ } = await getMovies();
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
  // ↑追加

  // ↓削除
  // const { movies }: { movies: Movie[] } = {
  //   movies: [
  //     ...（略）...
  //   ],
  // };
  // console.log(movies);
  // ↑削除

  return (
    <>
      <ListMovie phrase={phrase} movies={movies} />
    </>
  );
};

export default ListMovieDaily;
```

バックエンドサーバを起動した状態で、ブラウザで下記 URL にアクセスしてください。

- [http://localhost:3000/](http://localhost:3000/)

バックエンドサーバから取得した映画リストが表示されます。ブラウザを更新すると、映画リストがランダムに切り替わります。

#### 参考

1. [Functions: fetch \| Next.js](https://nextjs.org/docs/app/api-reference/functions/fetch)
1. 手島拓也，吉田健人，高林佳稀，『TypeScript と React/Next.js でつくる 実践 Web アプリケーション開発』，技術評論社，2022．
   - 6.2 API クライアントの実装
1. [【Next.js13】最新バージョンの Next.js13 をマイクロブログ構築しながら基礎と本質を学ぶ講座 \| Udemy](https://www.udemy.com/course/nextjs13_learning_with_microblog/)
   - SSR と SSG ってなに？使い分けはどうするの？
1. [【React アプリ開発】3 種類の React アプリケーションを構築して、React の理解をさらに深めるステップアップ講座 \| Udemy](https://www.udemy.com/course/react-3project-app-udemy/)
   - 実際にポケモンのデータを取得してみよう

{% endraw %}

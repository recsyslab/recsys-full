---
title: 映画APIの実装
layout: default
---

{% include header.html %}

{% raw %}

# 映画APIの実装

## 映画取得API
`frontend/src/services/movies/getMovies.ts`
```ts
import { ApiContext, Movie } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * 映画リスト取得API
 * @returns 映画リスト
 */
const getMovies = async (): Promise<{ movies: Movie[] }> => {
  return await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/movies/`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
};

export default getMovies;
```

## インデックスページ
`frontend/src/app/page.tsx`
```tsx
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import HelloAccount from './components/HelloAccount';
import connectUser from '@/services/users/connectUser';
import MovieList from './components/movie/MovieList';
import getMovies from '@/services/movies/getMovies'; // <- 追加

const PER_PAGE = 5;

const Index = async () => {
  await connectUser();
  const { movies } = await getMovies(); // <- 修正

  return (
...（略）...
  );
};

export default Index;
```

ブラウザで下記URLにアクセスすると、バックエンドサーバから取得した映画リストが表示されます。ブラウザを更新すると、映画リストがランダムに切り替わります。
- [http://localhost:3000](http://localhost:3000)

#### 参考
1. [Functions: fetch \| Next.js](https://nextjs.org/docs/app/api-reference/functions/fetch)
1. 手島拓也，吉田健人，高林佳稀，『TypeScriptとReact/Next.jsでつくる 実践Webアプリケーション開発』，技術評論社，2022．
   - 6.2 APIクライアントの実装
1. [【Next.js13】最新バージョンのNext.js13をマイクロブログ構築しながら基礎と本質を学ぶ講座 \| Udemy](https://www.udemy.com/course/nextjs13_learning_with_microblog/)
   - SSRとSSGってなに？使い分けはどうするの？
1. [【Reactアプリ開発】3種類のReactアプリケーションを構築して、Reactの理解をさらに深めるステップアップ講座 \| Udemy](https://www.udemy.com/course/react-3project-app-udemy/)
   - 実際にポケモンのデータを取得してみよう

{% endraw %}

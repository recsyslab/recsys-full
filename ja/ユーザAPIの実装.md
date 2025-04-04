---
title: ユーザAPIの実装
layout: default
---

{% include header.html %}

{% raw %}

# ユーザAPIの実装

## ユーザ型の定義
`frontend/src/types/data.d.ts`
```ts
// API Context
export type ApiContext = {
  apiRootUrl: string | undefined;
};

// ↓追加
// ユーザ
export type User = {
  id: string;
  email: string;
};
// ↑追加
```

## ユーザ取得API
`frontend/src/services/users/getUser.ts`
```ts
import { ApiContext, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * ユーザ取得API
 * @param email - emailアドレス
 * @returns ユーザ
 */
const getUser = async (email: string): Promise<User> => {
  const res = await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/users/?email=${email}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  return await res.users.at(0);
};

export default getUser;
```

## ユーザ登録API
`frontend/src/services/users/postUser.ts`
```tsx
import { ApiContext, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * ユーザ登録API
 * @param email - emailアドレス
 * @returns ユーザ
 */
const postUser = async (email: string): Promise<User> => {
  const body = {
    email: email,
  };
  return await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/users/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export default postUser;
```

## emailアドレスとデータベース上のユーザとの紐付け
`frontend/src/services/users/connectUser.ts`
```tsx
'use server';
import { auth } from '@/auth';
import getUser from './getUser';
import postUser from './postUser';

/**
 * サインインユーザとデータベース上のユーザとを紐付ける。
 */
const connectUser = async (): Promise<void> => {
  const session = await auth();

  if (session) {
    // サインインユーザのemailアドレスがデータベース上に登録されていれば、そのユーザの情報を取得する。
    const user = await getUser(session.user?.email!);

    // データベース上に登録されていなければ、そのユーザを新規登録する。
    if (!user) {
      await postUser(session.user?.email!);
    }
  }
};

export default connectUser;
```

## サインイン直後の紐付け

各URLに対応するページから`connectUser()`を呼び出すことで、サインイン直後にサインインユーザとデータベース上のユーザとを紐付けます。

`frontend/src/app/page.tsx`
```tsx
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import HelloAccount from './components/HelloAccount';
import connectUser from '@/services/users/connectUser'; // <- 追加

const Index = async () => { // <- asyncを追加
  await connectUser(); // <- 追加

  return (
    <>
      <section>
        <SessionProvider>
          <HelloAccount />
        </SessionProvider>
      </section>
    </>
  );
};

export default Index;
```

`frontend/src/app/myaccount/page.tsx`
```tsx
import React from 'react';
import { auth } from '@/auth';
import connectUser from '@/services/users/connectUser'; // <- 追加

const MyAccountPage = async () => {
  await connectUser(); // <- 追加
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <>
      <h1>Server Side</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
};

export default MyAccountPage;
```

ブラウザで下記URLにアクセスし、サインインしてください。
- [http://localhost:3000](http://localhost:3000)

初回のサインインの場合、`users`テーブルにユーザデータが登録されます。
```pgsql
recsys_full=# SELECT * FROM users;
```

2回目以降のサインインの場合、emailアドレスをキーに、`users`テーブル内の既存のユーザデータと紐付けられます。

#### 参考
1. 株式会社オープントーン，佐藤大輔，伊東直喜，上野啓二，『実装で学ぶフルスタックWeb開発 エンジニアの視野と知識を広げる「一気通貫」型ハンズオン』，翔泳社，2023．
   - 6-9-2 参照系機能のつなぎ込み
1. [【Next.js13】最新バージョンのNext.js13をマイクロブログ構築しながら基礎と本質を学ぶ講座 \| Udemy](https://www.udemy.com/course/nextjs13_learning_with_microblog/)
   - SSRとSSGってなに？使い分けはどうするの？
1. [【Reactアプリ開発】3種類のReactアプリケーションを構築して、Reactの理解をさらに深めるステップアップ講座 \| Udemy](https://www.udemy.com/course/react-3project-app-udemy/)
   - 実際にポケモンのデータを取得してみよう

{% endraw %}

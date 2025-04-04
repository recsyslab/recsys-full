---
title: NextAuthのインストール
layout: default
---

{% include header.html %}

{% raw %}

# NextAuthのインストール

## パッケージのインストール
```bash
frontend$ yarn add next-auth@beta
frontend$ less package.json
...（略）...
  "dependencies": {
    "next": "15.2.4",
    "next-auth": "^5.0.0-beta.25",  # <-
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
...（略）...
```

## 設定
```bash
frontend$ openssl rand -base64 33
【ランダム文字列】
```

取得した【ランダム文字列】を下記に貼り付けてください。

`frontend/.env.local`
```txt
AUTH_SECRET=【ランダム文字列】
```

## auth.ts
`frontend/src/auth.ts`
```ts
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
```

## Routeハンドラ
`frontend/src/app/api/auth/[...nextauth]/route.ts`
```ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

## ミドルウェア
`frontend/src/middleware.ts`
```ts
export { auth as middleware } from '@/auth';
```

#### 参考
1. [Auth.js \| Installation](https://authjs.dev/getting-started/installation)
1. [【NextAuth.js入門】ユーザー認証機能ならこれで決まり。Next.jsとNextAuth.jsで認証機能をサクッと実装しよう【Auth.js v5対応】 - YouTube](https://www.youtube.com/watch?v=2xexm8VXwj8)

{% endraw %}

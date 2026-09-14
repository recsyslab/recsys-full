---
title: 認証APIの実装
layout: default
---

{% include header.html %}

{% raw %}

# 認証 API の実装

## データ型の定義

`src/frontend/src/types/data.d.ts`

```ts
// API Context
export type ApiContext = {
  apiRootUrl?: string | undefined;
};

// ↓追加
// ユーザモデル
export type User = {
  id: string;
  user_id: string;
  user_email: string;
};
// ↑追加
```

## サインアップ API

`src/frontend/src/api/auth/signUp.ts`

```ts
import { ApiContext, User } from "@/types/data";
import { fetcher } from "@/utils";

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export type SignUpResponse = {
  user: User;
  access: string;
  refresh: string;
};

/**
 * サインアップAPI
 * @param email - emailアドレス
 * @param password - パスワード
 * @returns ユーザ + JWTトークン
 */
const signUp = async (
  email: string,
  password: string,
): Promise<SignUpResponse> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, "")}/accounts/signup/`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ email, password });

  return await fetcher(url, {
    method: "POST",
    headers: headers,
    body: body,
  });
};

export default signUp;
```

## サインイン API

`src/frontend/src/api/auth/signIn.ts`

```ts
import { ApiContext } from "@/types/data";
import { fetcher } from "@/utils";

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export type SignInResponse = {
  access: string;
  refresh: string;
};

/**
 * サインインAPI
 * @param email - emailアドレス
 * @param password - パスワード
 * @returns JWTトークン(access, refresh)
 */
const signIn = async (
  email: string,
  password: string,
): Promise<SignInResponse> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, "")}/accounts/signin/`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ email, password });

  return await fetcher(url, {
    method: "POST",
    headers: headers,
    body: body,
  });
};

export default signIn;
```

## サインアウト API

`src/frontend/src/api/auth/signOut.ts`

```ts
import { ApiContext } from "@/types/data";
import { fetcher } from "@/utils";

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * サインアウトAPI
 */
const signOut = async (): Promise<void> => {
  const access =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

  // 即 localStorage を削除（成功失敗関係なく）
  if (typeof window !== "undefined") {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

  if (!access) return;

  const url = `${context.apiRootUrl?.replace(/\/$/g, "")}/accounts/signout/`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
  };
  const body = JSON.stringify({ refresh });

  return await fetcher(url, {
    method: "POST",
    headers: headers,
    body: body,
  });
};

export default signOut;
```

{% endraw %}

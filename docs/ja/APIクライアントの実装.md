---
title: APIクライアントの実装
layout: default
---

{% include header.html %}

{% raw %}

# API クライアントの実装

## 環境変数の設定

`src/frontend/.env.local`

```.env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/
```

## 定数の定義

`src/frontend/src/constants/messages.ts`

```ts
/**
 * エラーメッセージの定数
 */
export const ERROR_MESSAGES = {
  // API関連
  API_REQUEST_ERROR: "APIリクエスト中にエラーが発生しました",
} as const;
```

`src/frontend/src/constants/index.ts`

```ts
export * from "./styles";
export * from "./settings";
export * from "./messages"; // <- 追加
```

## データ型の定義

`src/frontend/src/types/data.d.ts`

```ts
// API Context
export type ApiContext = {
  apiRootUrl?: string | undefined;
};
```

## ユーティリティ関数の定義

`src/frontend/src/utils/api.ts`

```ts
import { ERROR_MESSAGES } from "@/constants";

export const fetcher = async (
  resource: RequestInfo,
  init?: RequestInit,
): Promise<any> => {
  const res = await fetch(resource, init);

  if (!res.ok) {
    const error = new Error(ERROR_MESSAGES.API_REQUEST_ERROR);
    throw error;
  }

  return res.json();
};
```

`src/frontend/src/utils/index.ts`

```ts
export * from "./api";
```

#### 参考

1. [Functions: fetch \| Next.js](https://nextjs.org/docs/app/api-reference/functions/fetch)
1. 手島拓也，吉田健人，高林佳稀，『TypeScript と React/Next.js でつくる 実践 Web アプリケーション開発』，技術評論社，2022．
   - 6.2 API クライアントの実装

{% endraw %}

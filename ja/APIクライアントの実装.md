---
title: APIクライアントの実装
layout: default
---

{% include header.html %}

{% raw %}

# APIクライアントの実装

## 環境変数の設定
`frontend/.env.local`
```.env
...（略）...
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/online/  # <- 追加
```

## データ型の定義
`frontend/src/types/data.d.ts`
```ts
// API Context
export type ApiContext = {
  apiRootUrl: string | undefined;
};
```

## fetcher関数
`frontend/src/utils/index.ts`
```ts
export const fetcher = async (resource: RequestInfo, init?: RequestInit): Promise<any> => {
  const res = await fetch(resource, init);

  if (!res.ok) {
    const errorRes = await res.json();
    const error = new Error(errorRes.message ?? 'APIリクエスト中にエラーが発生しました');

    throw error;
  }

  return res.json();
};
```

#### 参考
1. [Functions: fetch \| Next.js](https://nextjs.org/docs/app/api-reference/functions/fetch)
1. 手島拓也，吉田健人，高林佳稀，『TypeScriptとReact/Next.jsでつくる 実践Webアプリケーション開発』，技術評論社，2022．
   - 6.2 APIクライアントの実装

{% endraw %}


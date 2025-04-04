---
title: NotFoundページの作成
layout: default
---

{% include header.html %}

{% raw %}

# NotFoundページの作成

## not-found.tsxの作成
`frontend/src/app/not-found.tsx`
```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </>
  );
}
```

## NotFoundページの確認
`frontend/src/utils/index.ts`
```ts
import { notFound } from 'next/navigation'; // <- 追加

export const fetcher = async (resource: RequestInfo, init?: RequestInit): Promise<any> => {
  const res = await fetch(resource, init);

  // ↓追加
  if (res.status === 404) {
    notFound();
  }
  // ↑追加
...（略）...
};
```

ブラウザで下記URLにアクセスすると、「Not Found」と表示されます。
- [http://localhost:3000/movies/-1](http://localhost:3000/movies/-1)

#### 参考
1. [File Conventions: not-found.js \| Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

{% endraw %}

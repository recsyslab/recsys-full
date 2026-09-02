---
title: NotFoundページの作成
layout: default
---

{% include header.html %}

{% raw %}

# NotFound ページの作成

## not-found.tsx の作成

`src/frontend/src/app/not-found.tsx`

```tsx
import Link from "next/link";

import { STYLES } from "@/constants/styles";

export default function NotFound() {
  return (
    <div className={`${STYLES.ERROR_PAGE}`}>
      <div className={`${STYLES.ERROR_PAGE_CARD}`}>
        <h1 className={`${STYLES.ERROR_PAGE_TITLE}`}>Not Found</h1>
        <Link className={`${STYLES.LINK}`} href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
```

## NotFound ページの確認

`src/frontend/src/app/components/ui/card/CardMovieDetail.tsx`

```tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { notFound } from 'next/navigation'; // <- 追加
import Image from 'next/image';
...（略）...
/**
 * 映画（詳細）カードコンポーネント
 */
const CardMovieDetail = (props: Props) => {
  ...（略）...
  if (!movie) {
    notFound(); // <- 修正
  }
  ...（略）...
};

export default CardMovieDetail;
```

`src/frontend/src/utils/api.ts`

```ts
import { notFound } from 'next/navigation'; // <- 追加
import { ERROR_MESSAGES } from '@/constants';

export const fetcher = async (resource: RequestInfo, init?: RequestInit): Promise<any> => {
  const res = await fetch(resource, init);

  if (res.status === 404) {
    notFound();
  }
  ...（略）...
};
```

ブラウザで下記 URL にアクセスしてください。

- [http://localhost:3000/movies/-1](http://localhost:3000/movies/-1)

「Not Found」と表示されます。

#### 参考

1. [File Conventions: not-found.js \| Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

{% endraw %}

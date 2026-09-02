---
title: Aboutページの作成
layout: default
---

{% include header.html %}

{% raw %}

# About ページの作成

## 定数の定義

`src/frontend/src/constants/styles.ts`

```ts
/**
 * スタイル関連の定数
 */
export const STYLES = {
  ...（略）...
  // ↓追加
  // Aboutページ関連
  ABOUT_PAGE: `flex min-h-screen items-center justify-center bg-gray-100`,
  ABOUT_PAGE_CARD: `w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-lg`,
  ABOUT_PAGE_TITLE: `mb-6 text-center text-2xl font-bold`,
  ABOUT_CREDIT_CARD: `m-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg`,
  ABOUT_REFERENCE: `m-2 text-sm`,
  // ↑追加
} as const;
```

## About ページ

`src/frontend/src/app/about/page.tsx`

```tsx
import Link from "next/link";
import { STYLES } from "@/constants";

const About = () => {
  return (
    <div className={`${STYLES.ABOUT_PAGE}`}>
      <div className={`${STYLES.ABOUT_PAGE_CARD}`}>
        <h1 className={`${STYLES.ABOUT_PAGE_TITLE}`}>
          Acknowledgments & Credits
        </h1>
        <article className={`${STYLES.ABOUT_CREDIT_CARD}`}>
          This site uses&nbsp;
          <Link
            className={`${STYLES.LINK}`}
            href="https://grouplens.org/datasets/movielens/latest/"
          >
            the MovieLens Latest Datasets
          </Link>
          &nbsp;with permission from GroupLens but is not endorsed or certified
          by them.
          <div className={`${STYLES.ABOUT_REFERENCE}`}>
            F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens
            Datasets: History and Context. ACM Transactions on Interactive
            Intelligent Systems (TiiS) 5, 4: 19:1–19:19.
            <div>
              <Link
                className={`${STYLES.LINK}`}
                href="https://doi.org/10.1145/2827872"
              >
                https://doi.org/10.1145/2827872
              </Link>
            </div>
          </div>
        </article>
        <article className={`${STYLES.ABOUT_CREDIT_CARD}`}>
          This site uses&nbsp;
          <Link className={`${STYLES.LINK}`} href="https://www.omdbapi.com/">
            the OMDb API
          </Link>
          &nbsp; but is not endorsed or certified by OMDb API.
        </article>
      </div>
    </div>
  );
};

export default About;
```

## ヘッダ

`src/frontend/src/app/components/Header.tsx`

```tsx
import Link from 'next/link';

import { STYLES, SETTINGS } from '@/constants';

const Header = () => {
  return (
    ...（略）...
        <nav className={`${STYLES.HEADER_MENU}`}>
          <Link href="/about/">About</Link> {/* <- 修正 */}
          <div>Sign Up</div>
          <div>Sign In</div>
        </nav>
    ...（略）...
  );
};

export default Header;
```

ブラウザで下記 URL にアクセスするか、ヘッダから**About**をクリックすると、About ページが表示されます。

- [http://localhost:3000/about](http://localhost:3000/about)

{% endraw %}

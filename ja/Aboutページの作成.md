---
title: Aboutページの作成
layout: default
---

{% include header.html %}

{% raw %}

# Aboutページの作成

## Aboutページ
`frontend/src/app/about/page.tsx`
```tsx
import Link from 'next/link';
import React from 'react';

const About = () => {
  return (
    <>
      <div className="m-8 border-2 border-gray-200 p-4 text-gray-800">
        <h1 className="text-2xl">Acknowledgments & Credits</h1>
        <div className="m-2 p-2">
          This site uses&nbsp;
          <Link
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            href="https://grouplens.org/datasets/movielens/latest/"
          >
            the MovieLens Latest Datasets
          </Link>
          &nbsp;with permission from GroupLens but is not endorsed or certified by them.
          <div className="m-2 text-sm">
            F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets: History and
            Context. ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19:1–19:19.
            <div>
              <Link
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                href="https://doi.org/10.1145/2827872"
              >
                https://doi.org/10.1145/2827872
              </Link>
            </div>
          </div>
        </div>
        <div className="m-2 p-2">
          This site uses&nbsp;
          <Link
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            href="https://www.omdbapi.com/"
          >
            the OMDb API
          </Link>
          &nbsp; but is not endorsed or certified by OMDb API.
        </div>
      </div>
    </>
  );
};

export default About;
```

## ヘッダ
`frontend/src/app/components/Header.tsx`
```tsx
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-blue-600 px-8 py-4 text-white">
...（略）...
      <div>
        <nav className="flex items-center justify-between text-sm font-medium">
          <div className="p-2">
            <Link href="/about/">About</Link>  {/* <- Linkを追加 */}
          </div>
          <div className="p-2">Sign In</div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

ブラウザで下記URLにアクセスするか、ヘッダから**About**をクリックすると、Aboutページが表示されます。
- [http://localhost:3000/about](http://localhost:3000/about)

{% endraw %}

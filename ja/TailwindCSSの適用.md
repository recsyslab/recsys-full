---
title: TailwindCSSの適用
layout: default
---

{% include header.html %}

{% raw %}

# TailwindCSSの適用

## ヘッダ
`frontend/src/app/components/Header.tsx`
```tsx
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-blue-600 px-8 py-4 text-white">   {/* <- classNameを追加 */}
      <div>
        <h1 className="text-2xl font-extrabold">                                              {/* <- classNameを追加 */}
          <Link href="/">recsys-full</Link>
        </h1>
      </div>
      <div>
        <nav className="flex items-center justify-between text-sm font-medium">               {/* <- classNameを追加 */}
          <div className="p-2">About</div>                                                    {/* <- classNameを追加 */}
          <div className="p-2">Sign In</div>                                                  {/* <- classNameを追加 */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

## フッタ
`frontend/src/app/components/Footer.tsx`
```tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t px-4 py-2">  {/* <- classNameを追加 */}
      <small>@2025 RecSysLab</small>
    </footer>
  );
};

export default Footer;
```

## 共通レイアウト
`frontend/src/app/layout.tsx`
```tsx
...（略）...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* ↓修正 */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-800 antialiased`}
      >
      {/* ↑修正 */}
        <div className="flex min-h-screen flex-col">     {/* <- classNameを追加 */}
          <Header />
          <main className="flex-grow">{children}</main>  {/* <- classNameを追加 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

ブラウザで下記URLにアクセスし、スタイルが適用されていることを確認してください。
- [http://localhost:3000](http://localhost:3000)

#### 参考
1. [Installation - Tailwind CSS](https://tailwindcss.com/docs/installation)
1. [Tailwind Stamps - Resuable Tailwind HTML Components](https://tailwindcss.5balloons.info/)

{% endraw %}

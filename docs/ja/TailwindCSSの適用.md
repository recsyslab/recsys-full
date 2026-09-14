---
title: TailwindCSSの適用
layout: default
---

{% include header.html %}

{% raw %}

# TailwindCSS の適用

## ヘッダ

`src/frontend/src/app/components/Header.tsx`

```tsx
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-sky-600 px-8 py-4 text-white">
      {/* <- classNameを追加 */}
      <div>
        <h1 className="text-2xl font-extrabold">
          {/* <- classNameを追加 */}
          <Link href="/">recsys-full</Link>
        </h1>
      </div>
      <div>
        <nav className="flex items-center justify-between gap-4 text-sm font-medium">
          {/* <- classNameを追加 */}
          <div>About</div>
          <div>Sign Up</div>
          <div>Sign In</div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

## フッタ

`src/frontend/src/app/components/Footer.tsx`

```tsx
const Footer = () => {
  return (
    <footer className="border-t px-4 py-2">
      {/* <- classNameを追加 */}
      <small>@2025 RecSysLab</small>
    </footer>
  );
};

export default Footer;
```

## 共通レイアウト

`src/frontend/src/app/layout.tsx`

```tsx
...（略）...
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col bg-gray-100 text-gray-700 antialiased">
        {/* <- classNameを修正 */}
        <Header />
        <main className="grow">{children}</main> {/* <- classNameを追加 */}
        <Footer />
      </body>
    </html>
  );
}
```

ブラウザで下記 URL にアクセスし、スタイルが適用されていることを確認してください。

- [http://localhost:3000/](http://localhost:3000/)

#### 参考

1. [Installation - Tailwind CSS](https://tailwindcss.com/docs/installation)
1. [Tailwind Stamps - Resuable Tailwind HTML Components](https://tailwindcss.5balloons.info/)

{% endraw %}

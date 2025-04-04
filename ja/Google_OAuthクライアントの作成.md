---
title: Google OAuthクライアントの作成
layout: default
---

{% include header.html %}

{% raw %}

# Google OAuthクライアントの作成

## Google OAuthクライアントの作成
1. 下記にアクセスし、Google Cloud Platformにログインする。
   - [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. ナビゲーション メニューから、**APIとサービス**を開く。
   1. 上部の**プロジェクトを作成**リンクをクリックする。
      1. 下記を設定し、**作成**ボタンをクリックする。
         - **プロジェクト名**: `recsys-full`
         - **組織**: 【自分の組織】
         - **場所**: 【自分の場所】
   2. 上部のプロジェクト名をクリックし、**リソースを選択**画面を開く。
      1. `recsys-full`を選択する。
3. ナビゲーション メニューから、**APIとサービス > OAuth 同意画面**を開く。
   1. **開始**ボタンをクリックする。
      1. 下記を設定し、**作成**ボタンをクリックする。
         - **アプリ情報 > アプリ名**: `recsys-full`
         - **アプリ情報 > ユーザー サポートメール**: 【自分のメールアドレス】
         - **対象**: `外部`
         - **連絡先情報**: 【自分のメールアドレス】
         - **終了 > Google API サービス: ユーザーデータに関するポリシー に同意します。**: `チェック`
   2. 左メニューから**クライアント**を開く。
      1. **クライアントを作成**リンクをクリックする。
      2. 下記を設定し、**作成**ボタンをクリックする。
         - **アプリケーションの種類**: `ウェブ アプリケーション`
         - **名前**: `recsys-full`
         - **承認済みのJavaScript生成元 > URI 1**: `http://localhost:3000`
         - **承認済みのリダイレクトURI > URI 1**: `http://localhost:3000/api/auth/callback/google`
           - [http://localhost:3000/api/auth/providers](http://localhost:3000/api/auth/providers)にアクセスした際、`"callbackUrl"`として取得されるURL
      3. OAuthクライアントが作成された後、下記をメモし、**OK**ボタンをクリックする。
         - **クライアント ID**: 【クライアントID】
         - **クライアント シークレット**: 【クライアントシークレット】
           - クライアント シークレットは再表示できないので注意

## 環境変数

取得した【クライアント ID】と【クライアントシークレット】を下記に貼り付けてください。

`frontend/.env.local`
```txt
AUTH_SECRET=【ランダム文字列】

AUTH_GOOGLE_ID=【クライアントID】                # <- 追加
AUTH_GOOGLE_SECRET=【クライアントシークレット】  # <- 追加
```

## プロバイダのセットアップ
`frontend/src/auth.ts`
```ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google'; // <- 追加

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google], // <- Googleを追加
});
```

`frontend/src/app/components/Header.tsx`
```tsx
...（略）...
const Header = () => {
  return (
...（略）...
        <nav className="flex items-center justify-between text-sm font-medium">
          <div className="p-2">
            <Link href="/about/">About</Link>
          </div>
          <div className="p-2">
            <ButtonSignIn provider="Google" /> {/* <- Googleを追加 */}
          </div>
          <AccountMenu />
        </nav>
...（略）...
  );
};

export default Header;
```

ブラウザで下記URLにアクセスし、ヘッダから**Sign In**をクリックすると、**Sign in with Google**ボタンが表示されます。任意のアカウントを選択し、サインインしてください。サインアウトするときは、右上のアカウントメニューから、**Sign Out**をクリックしてください。ただし、現時点では、認証状態は判定できていません。
- [http://localhost:3000](http://localhost:3000)

#### 参考
1. [NextAuthによるGoogle認証](https://zenn.dev/activecore/articles/6b9f883f147107)
1. [OAuth Providers](https://authjs.dev/getting-started/authentication/oauth)

{% endraw %}

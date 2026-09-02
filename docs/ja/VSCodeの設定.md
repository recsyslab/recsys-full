---
title: VSCodeの設定
layout: default
---

{% include header.html %}

{% raw %}

# VSCode の設定

## VSCode の起動

```bash
(recsys_full) $
 cd ~/dev/recsys-full/
 code .
```

## プラグインのインストール

1. VSCode の左メニューから**拡張機能**を開き、下記の各プラグインをインストールする。
   - **Python**
   - **ES7+ React/Redux/React-Native snippets**
     - React 用のタグ補完
     - `rafce`コマンドでひな形を作成できる
   - **Djaneiro - Django Snippets**
     - Django 用のタグ補完
   - **Auto Rename Tag**
     - 対応するタグを自動的に編集
   - **Auto Close Tag**
     - 閉じタグを自動的に追加
   - **HTML CSS Support**
     - HTML CSS を補完
   - **Material Icon Thema**
     - ファイルのアイコンが自動的に付加される
   - **Prettier - Code formatter**
     - 自動的にコードを整形
   - **Tailwind CSS IntelliSense**
     - Tailwind CSS のクラス名を自動補完
   - **Japanese Language Pack for Visual Studio Code**
     - VSCode の日本語化

## 設定

### Prettier, Tailwind CSSの設定

1. **ファイル > ユーザー設定 > 設定**を開く。
   1. 下記を設定する。
      - **Editor: Format On Save**: `チェック` # Prettier
      - **Editor: Default Formatter**: `Prettier - Code formatter` # Prettier
      - **Editor: Tab Size**: `2`
      - **Files: Associations** # Tailwind CSS IntelliSense
        - **項目**: `*.css`
        - **値**: `tailwindcss`

### Python: インタープリターの設定

1. **管理 > コマンド パレット**を開く。
   1. **Python: Select Interpreter**を開く。
   2. 下記を選択する。
      - `recsys_full (3.12.6) ~/venv/recsys_full/bin/python`

## .gitignoreの設定

`.gitignore`

```.gitignore
.vscode/
```

#### 参考

1. [【Next.js13】最新バージョンの Next.js13 をマイクロブログ構築しながら基礎と本質を学ぶ講座 \| Udemy](https://www.udemy.com/course/nextjs13_learning_with_microblog/?couponCode=KEEPLEARNING)
1. [【Tailwind CSS】Unknown at rule @tailwind 解消法【VSCode】 #Next.js - Qiita](https://qiita.com/P-man_Brown/items/bf05437afecde268ec15)
1. [Editor Setup - Tailwind CSS](https://tailwindcss.com/docs/editor-setup)

{% endraw %}

# Maximum Blog

## 技術スタック

- Next.js (SSG)
- Github Pages

## 開発方法

### 共通の準備

```bash
git clone https://github.com/saitamau-maximum/blog.git
cd blog
pnpm install
# もしpnpmがない場合は`npm install -g pnpm`でインストールしてから`pnpm install`を実行してください。
```

### ローカルでの開発

```bash
pnpm dev
# `http://localhost:3000`にアクセスしてください。
```

開発するときは`main`ブランチからブランチを切ってください。

```bash
git checkout -b feat/your-feature-name
```

ブランチは`feat/`から始めてください。
例えばメンバー一覧ページを作る場合は`feat/members`というブランチ名になります。

作業が終わったら`main`に向けてプルリクエストを作成してください。

### ブログ執筆

ブログ執筆にはブランチを切ってください。

```bash
git checkout -b feat/your-blog-name
```

例えば入門講習会の第4回のブログを書く場合は`feat/intro-course-4`というブランチ名になります。

ブログを書き終わったら`main`に向けてプルリクエストを作成してください。

`blog/`以下に`{slug}.md`というファイルを作成してください。`slug`はURLの一部になります。

たとえば`blog/intro-course-4.md`というファイルを作成した場合、`http://localhost:3000/blog/intro-course-4`でアクセスできます。

ファイルの中身は以下のようになっています。

```md
---
title: "Maximumとは"
description: "埼玉大学のプログラミングサークル「Maximum」を紹介します。"
authors: ["taro", "jiro", "saburo"]
tags: ["maximum", "埼玉大学", "プログラミングサークル"]
prev: "previous-blog"
next: "next-blog"
---
```

| フィールド名 | 説明 | 必須か | 備考 |
| --- | --- | --- | --- |
| title | ブログのタイトル | ⭕️ | |
| description | ブログの説明 | ⭕️ | |
| authors | ブログの執筆者 | ⭕️ | 複数人設定できるので、共同執筆も可能です。githubのユーザー名で設定してください。 |
| tags | ブログのタグ | ⭕️ | 複数設定できます。もしタグがない場合は`[]`としてください。 |
| prev | 前のブログ(前章) | ❌ | 前のブログがない場合はそもそもこのフィールドを設定しないでください。 |
| next | 次のブログ(次章) | ❌ | 次のブログがない場合はそもそもこのフィールドを設定しないでください。 |

## バグや新規機能の提案

バグの報告や新規機能の提案があれば気軽に**Issues**に投稿してください。

## 開発への参加方法

開発へ参加したい方は**Issues**から自分のやりたいことを探して、**Assignees**に自分を追加してください。
すると「自分がこのIssueを担当している」ということになります。
あとはいつものようにブランチを切って開発してください。

## Support

### Mac環境で`pnpm i`したときに`node-pre-gyp`のエラーが出る場合

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

を打ってから`pnpm i`を実行してください。
<https://github.com/Automattic/node-canvas/issues/913>

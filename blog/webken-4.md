---
title: "【第4回】 Git/Githubを使って共同開発をしてみよう"
description: "会社やサークルなどの組織の中で、複数人で同じプログラムを開発することはよくあります。GitとGithubを使って並行して開発する方法を学びましょう。"
date: "2023-05-15"
authors: ["sor4chi"]
tags: ["Web研究会", "git", "github"]
---

## おさらい

前回[【第3回】 Git/Githubを使ってコードを管理しよう](/blog/webken-3/)では、GitとGithubを実際に使ってみました。

### Gitの基本的な流れ

Gitを使う上での基本的な流れをおさらいしておきましょう。

Gitは**ローカル**でファイルの変更履歴を管理する仕組み・ツールです。

まずはローカルに**リポジトリ**を作成します。
リポジトリとは、Gitで管理するファイルやディレクトリのことを指します。
`git init`コマンドを実行することで、そのディレクトリをリポジトリとして扱うことができます。

- ファイルを変更する
- 変更をステージに**Add**する `git add <file>`
- 変更を**Commit**する `git commit -m "<message>"`

これを繰り返すことで、変更履歴を管理することができます。

いまどの状態かを確認するには、`git status`を実行します。
過去の変更履歴を確認するには、`git log`を実行します。

### Githubの基本的な流れ

Githubを使う上での基本的な流れをおさらいしておきましょう。

Githubは**リモート**でGitログのクラウド管理を行い、さらに不特定多数の人との共同開発をマネジメントする仕組み・ツール・サイトです。

- Github上でリポジトリを作成する
- Gitの**ローカル**リポジトリにリモートリポジトリを登録する `git remote add origin <url>`
- ローカルリポジトリの変更をリモートリポジトリに**Push**する `git push origin <branch>`

これを繰り返すことで、リモートリポジトリに変更履歴をどんどん追加していくことができます。

### 使うコマンドまとめ

| 用語 | 役割 | コマンド | 例 |
| --- | --- | --- | --- |
| 初期化 | リポジトリを作成する | `git init` | `git init` |
| アド(ステージ) | 変更をステージに追加する | `git add <file>` | `git add index.html` |
| コミット | 変更をリポジトリに追加する | `git commit -m "<message>"` | `git commit -m "add index.html"` |
| プッシュ | 変更をリモートリポジトリに追加する | `git push origin <branch>` | `git push origin master` |
| ステータス | 現在の状態を確認する | `git status` | `git status` |
| ログ | 過去の変更履歴を確認する | `git log` | `git log` |
| リモート | リモートリポジトリを登録する | `git remote add origin <url>` | `git remote add origin

```mermaid
flowchart TB
    A[初期化]
    E{リモートリポジトリに登録済みか}
    G[リモートリポジトリを登録]
    F[リモートリポジトリにPush]
    subgraph サイクル
        B[ファイルを変更する]
        C[変更をステージにAddする]
        D[変更をCommitする]
        H{ひと段落ついたか}
    end
    A --> B
    B --> C
    C --> D
    D --> H
    H -- はい --> E
    H -- いいえ --> B
    E -- はい --> F
    E -- いいえ --> G
    G --> F
    F --> B
```

## Gitでの共同開発に必要な知識

### ブランチ

ブランチとは、リポジトリの変更履歴を分岐させることができる機能です。
**歴史**や樹形図のようなものをイメージするとわかりやすいです。

コミットを一まとまりとして扱うことができ、共同開発においてこの**ブランチ**が機能開発の単位となります。

ブランチを作成するには、`git branch <branch>`を実行します。
ブランチを切り替えるには、`git checkout <branch>`を実行します。

:::details[発展]
`git checkout`コマンドは、ブランチの切り替え以外にも、コミットの切り替えや、ファイルの復元などにも使うことができます。
過去のコミットへ一時的に戻りたいときは、`git checkout <commitのハッシュ>`を実行します。
(あたらに`git switch`コマンドが追加されまして、こちらも利用できます。)

また、便利コマンドとして、`git checkout -b <branch>`があります。
これは、`git branch <branch>`と`git checkout <branch>`を同時に実行するコマンドです。
**ブランチを作成して、そのブランチに切り替える**という作業を一度に行うことができます。
:::

### マージ

マージとは、ブランチを統合することです。
ブランチを作成して機能を開発し、その機能が完成したらマージして統合します。

マージをするには、`git merge <branch>`を実行します。
マージすると、マージ元のブランチにマージ先のブランチの変更履歴が追加されます。

### コンフリクト

コンフリクトとは、マージするときに起こる衝突のことです。
もちろん複数人や複数の歴史で同じ場所を変更すると衝突が起きますよね？

コンフリクトが起きたときは、`git status`でコンフリクトの場所を確認することができます。

## やってみよう

前回[【第3回】 Git/Githubを使ってコードを管理しよう](/blog/webken-3/)で作成したリポジトリを使います。

Gitではinitした時点で`main`というブランチが一番大元のブランチとして作成されます。

### ブランチを作成する

まずは、ブランチを作成してみましょう。
`git branch <branch>`を実行することで、ブランチを作成することができます。

```bash
git branch add-function
```

### ブランチを切り替える

次に、ブランチを切り替えてみましょう。
`git checkout <branch>`を実行することで、ブランチを切り替えることができます。

```bash
git checkout add-function
```

いまどのブランチにいるかを確認するには、`git branch`を実行します。

```bash
git branch
```

```txt
* add-function
  main
```

`*`がついているブランチが現在のブランチです。

### ファイルを変更する

ブランチを切り替えたら、ファイルを変更してみましょう。
ブランチ名のとおり、今回は`add`という関数を変更として追加してみます。

```cpp:main.cpp {4-6,9}
#include <bits/stdc++.h>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(3, -2) << endl;
    return 0;
}
```

### 変更をステージにAddする

ファイルを変更したら、変更をステージにAddしてみましょう。

```bash
git add main.cpp
```

### 変更をCommitする

ファイルを変更したら、変更をステージにAddしてみましょう。

```bash
git commit -m "足し算の関数を追加"
```

これで、変更履歴がリポジトリに追加されました。

### 確認してみよう

`git log`を実行して、変更履歴を確認してみましょう。

```bash
git log
```

```txt
commit <commitのハッシュ> (HEAD -> add-function)
Author: <username> <email>
Date:   <date>

    足し算の関数を追加

commit <commitのハッシュ> (origin/main, origin/HEAD, main)
Author: <username> <email>
Date:   <date>

    Hello WorldをHello Maximumに修正

commit <commitのハッシュ>
Author: <username> <email>
Date:   <date>

    Hello Worldと表示するプログラムを作成
```

`HEAD`がついているのが現在のブランチです。
`main`ではなく`add-function`になっていることがわかります。

### 視覚的に見る

VSCodeの拡張機能である[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)を使うと、視覚的に変更履歴を確認することができます。
これを使って、変更履歴を確認してみましょう。

はい、こんな感じで枝分かれした先に変更履歴が追加されていることがわかります。

では、`main`ブランチに戻ってみましょう。

```bash
git checkout main
```

### ローカルでマージする

`main`ブランチに戻ったら、`add-function`ブランチを`main`ブランチにマージしてみましょう。

```bash
git merge add-function
```

はい、これで`add-function`ブランチの変更履歴が`main`ブランチに追加されました。

### リモートリポジトリにPushする

ローカルでマージしたら、リモートリポジトリにPushしてみましょう。

```bash
git push origin main
```

これで、リモートリポジトリにも変更履歴が追加されました。

## Githubでの共同開発に必要な知識

Githubを使うことで、複数人で同じプログラムを開発することができます。
さらに[Maximum](https://github.com/saitama-maximum)など、組織を作って管理権限を付与したり、プロジェクトをまとめて管理したりすることもできます。

Githubでの共同開発に必要な知識を学びましょう。

### Issue

Issueとは、Github上でタスク管理を行う機能です。

Issueを作成することで、タスクを登録することができます。
**Issue Flow**という開発体制があり、一般にはこのフローで開発することが多いため、こちらをベースに説明していきます。

### Pull Request

先ほどブランチをローカル環境でMergeしましたが、共同開発たるもの、全て自分がMergeの権限を持つわけではありません。
そこでGithub上で「自分のコードよかったらMergeしてください」というリクエストを出すことができます。

これをPUll Requestと言います。

#### レビュー

コードがいいかどうかチェックする工程（主にGithub上でのこと）をレビューと言います。基本はテックリードやCTOに当たるポジションのエンジニアが、部下の開発したコードが動くか、正しく欠けているかをチェックします。

### リモートでのマージ

リモートでもローカルと同じようにMergeができます。MergeができるタイミングはPull Requestを承諾した時です。

## 実際にやってみましょう

### Issueを作成する

Issueを作成してみます。

今回は先ほど作った足し算の関数の引数が負の数だったときに、エラーを返すように修正してみます。

「Issue」タブをクリックして、New Issueをクリックします。

タイトルに「負の数の足し算を規制する」と入力し、本文に「負の数の足し算を規制する」と入力します。


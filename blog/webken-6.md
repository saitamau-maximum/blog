---
title: "【第6回】 データベースとアプリケーションサーバーを連携させてみよう"
description: "前回Node.jsのサーバーをセットアップするところまでやったので、今回はNode.jsのサーバーを使ってデータベースを操作してみます。"
date: "2023-05-29"
authors: ["sor4chi"]
tags: ["Web研究会", "sql", "database", "node.js"]
prev: "webken-5"
---

## おさらい

[前回](/blog/webken-5)は、**データベースの種類**と**データベースの基本的な操作**について学びました。

関係データベースでは、データを表形式で保存します。
**テーブル**と呼ばれる表の中に、**レコード**と呼ばれる一つ一つのデータが保存されます。
Excelだと、シートがテーブルに、行がレコードに相当します。

操作には**SQL**という言語を使います。

テーブル操作

- `CREATE TABLE`でテーブルを作成

レコード操作

- `INSERT INTO`でレコードを追加
- `SELECT`でレコードを取得
- `UPDATE`でレコードを更新
- `DELETE`でレコードを削除

レコードの操作4つは、**Create, Read, Update, Delete**を頭文字にとって**CRUD**と呼ばれることがあります。

**3層アーキテクチャ**という構成を学びました。
Webアプリを作るときは、**データ層**と**アプリケーション層**、**プレゼンテーション層**の3つの層に分けて作ると良いです。

| 名前 | 説明 | 例 |
| --- | --- | --- |
| データ層 | データベースやファイルなどのデータを扱う層 | データベース |
| アプリケーション層 | データ層からデータを取得して、加工したり、データを更新したりする層 | PHPやRuby、Python、Node.jsなどで作るサーバー |
| プレゼンテーション層 | ユーザーとやり取りする層 | HTMLやCSS、Javascriptなどのブラウザ、スマホアプリ |

## アプリケーション作成の続き-アプリケーション編

それでは前回DBとの連携をするためのセットアップができたので、今回は実際にプログラム（サーバー）を書いてDBを操作してみましょう。

### ユーザーとツイートのテーブルを作成

まず、`queries.js`を作成します。

```js:queries.js
const Tweets = {
    createTable: `
        CREATE TABLE IF NOT EXISTS tweets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME NOT NULL
        );
    `,
};

const Users = {
    createTable: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME NOT NULL
        );
    `,
};

module.exports = {
    Tweets,
    Users,
};
```

使うクエリを一つのファイルにまとめておくと後で見やすくなるため、今回は`queries.js`というファイルにクエリをまとめておきます。

`IF NOT EXISTS`というのは、テーブルが存在しない場合にのみテーブルを作成するという意味です。
これをつけておくことで最初にこのファイルを実行したときにテーブルが作成され、2回目以降はテーブルが存在するのでテーブルが作成されないようにします。

これで、`Tweets`と`Users`という2つのテーブルを作成するクエリが定義されました。

次に、`index.js`を以下のように編集します。

```js:index.js {2,6-9}
const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries');

const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run(queries.Tweets.createTable());
    db.run(queries.Users.createTable());
});

db.close();
```

`require('./queries')`で`queries.js`を読み込みます。
`queries.Tweets.createTable`は、`queries.js`で定義した`Tweets`の中の`createTable`という関数を呼び出しています。

:::details[余談]
プログラムにおいて**ファイル分割**はとても重要な概念です。
たとえば一つのファイルの中に1000行のコードが書かれていると、どこに何が書かれているのかわかりにくくなりますよね？

そのため、プログラムを書くときは、一つのファイルには一つの機能だけを書くようにしましょう。
この考え方は**単一責任の原則**と呼ばれています。

こう言った設計の仕方を勉強するのもプログラミングの醍醐味で、どうやったら他人が読みやすいコード設計ができるという**リーダブルコード**という着眼点をもつと、プログラミングがもっと楽しくなります。

ただし、言語によっては適切な分割をしていれば機能を集約したほうがいいという考え方をしている場合もあります。
最近ではJSでも**コロケーション**と言う、機能は違うけど同じような役割（ドメイン）のコードを一つのファイルにまとめるという考え方が流行っていて、その環境やプロジェクトによって適切な分割の仕方は変わってきます。
:::

`db.serialize`の中に書いた処理は、順番に実行されます。
`db.run`は、SQLを実行する関数です。

では実行してみましょう。

```bash
node index.js
```

`database.db`が作成されていれば成功です。
`database.db`を開いて、テーブルが作成されていることを確認してみましょう。

```bash
sqlite3 database.db
```

を実行して、sqliteのコンソールに入ります。

```sql
.tables
```

を実行すると、テーブルの一覧が表示されます。

```txt
tweets  users
```

と表示されれば成功です。

それではテーブルを作成する機能ができたので、コミットしておきましょう。

```bash
git add .
git commit -m "ユーザーとツイートのテーブルを作成"
```

確認のため、`git log`を実行してみましょう。

```bash
git log --oneline
```

`--oneline`をつけると、1コミットごとに1行で表示されます。（覚えなくても大丈夫です）

```txt
<id> (HEAD -> main) ユーザーとツイートのテーブルを作成
<id> データベースと接続する
```

### ユーザーを作成できるようにする

次に、ユーザーを作成できるようにしてみましょう。
`queries.js`を以下のように編集します。

```js:queries.js {10}
const Users = {
    createTable: `
        CREATE TABLE users IF NOT EXISTS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME NOT NULL
        );
    `,
    create: `INSERT INTO users (name, email, created_at) VALUES (?, ?, ?);`,
};
```

そして、`index.js`を以下のように編集します。

```js:index.js {10-12}
const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries');

const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run(queries.Tweets.createTable);
    db.run(queries.Users.createTable);

    db.run(queries.Users.create, 'りんご太郎', 'apple@example.com', '2022-08-15 00:00:00');
    db.run(queries.Users.create, 'みかん次郎', 'mikan@example.com', '2022-08-15 00:00:01');
    db.run(queries.Users.create, 'ぶどう三郎', 'budo@example.com', '2022-08-15 00:00:02');
});

db.close();
```

`?`は、後から値を埋め込むための**プレースホルダ**と呼ばれるものです。

:::details[?を含むクエリに関する補足]
`User.create`のクエリを

```js
create(name, email, created_at): `INSERT INTO users (name, email, created_at) VALUES ('${name}', '${email}', '${created_at}');`,
```

にしないの？と思うかもしれません。

しかし、このようにすると、「SQLインジェクション」というセキュリティ上の問題が発生します。
たとえば、`name`に`'); DROP TABLE users; --`という文字列を入れると、出力されるクエリは以下のようになります。

```sql
INSERT INTO users (name, email, created_at) VALUES (''); DROP TABLE users; --', 'hacker@example.com', '2023-05-21 00:00:00');
```

これにより、本来意図していないテーブルの削除が行われてしまいます。
そのため、`?`を使って、SQLインジェクションを防ぐようにしましょう。
これを使えば攻撃性のある命令に使われる特殊文字`'; --`などを命令ではなくそのまま文字列として埋め込むことができます。
:::

では実行してみましょう。

```bash
node index.js
```

`database.db`を開いて、ユーザーが作成されていることを確認してみましょう。

```bash
sqlite3 database.db
```

```sql
SELECT * FROM users;
```

```txt
1|りんご太郎|apple@example.com|2022-08-15 00:00:00
2|みかん次郎|mikan@example.com|2022-08-15 00:00:01
3|ぶどう三郎|budo@example.com|2022-08-15 00:00:02
```

と表示されれば成功です。

それではユーザーを作成できるようにする機能ができたので、コミットしておきましょう。

```bash
git add .
git commit -m "ユーザーを作成できるようにする"
```

### ツイートを作成できるようにする

次に、ツイートを作成できるようにしてみましょう。

`queries.js`を以下のように編集します。

```js:queries.js {10}
const Tweets = {
    createTable: `
        CREATE TABLE tweets IF NOT EXISTS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME NOT NULL
        );
    `,
    create: `INSERT INTO tweets (content, user_id, created_at) VALUES (?, ?, ?);`,
};
```

そして、`index.js`を以下のように編集します。

```js:index.js {14-16}
const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries');

const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run(queries.Tweets.createTable);
    db.run(queries.Users.createTable);

    db.run(queries.Users.create, 'りんご太郎', 'apple@example.com', '2022-08-15 00:00:00');
    db.run(queries.Users.create, 'みかん次郎', 'mikan@example.com', '2022-08-15 00:00:01');
    db.run(queries.Users.create, 'ぶどう三郎', 'budo@example.com', '2022-08-15 00:00:02');

    db.run(queries.Tweets.create, 'あけおめ！', 3, '2023-01-01 00:00:00');
    db.run(queries.Tweets.create, '今年もよろしくお願いします！', 2, '2023-01-01 00:00:01');
    db.run(queries.Tweets.create, '今年こそは痩せるぞ！', 1, '2023-01-01 00:00:02');
});

db.close();
```

では実行してみましょう。
そのまえに、`database.db`を削除しておきましょう。

```bash
rm database.db
```

こうしないと先ほど作った**User**レコードが被ってしまいます。

```bash
node index.js
```

`database.db`を開いて、ツイートが作成されていることを確認してみましょう。

```bash
sqlite3 database.db
```

```sql
SELECT * FROM tweets;
```

```txt
1|あけおめ！|3|2023-01-01 00:00:00
2|今年もよろしくお願いします！|2|2023-01-01 00:00:01
3|今年こそは痩せるぞ！|1|2023-01-01 00:00:02
```

と表示されれば成功です。

それではツイートを作成できるようにする機能ができたので、コミットしておきましょう。

```bash
git add .
git commit -m "ツイートを作成できるようにする"
```

### ツイート一覧やユーザー一覧を取得できるようにする

次に、ツイート一覧やユーザー一覧を取得できるようにしてみましょう。
これも`SELECT`文を使って処理を書くだけです。

`queries.js`を以下のように編集します。

```js:queries.js {11,24}
const Tweets = {
    createTable: `
            CREATE TABLE IF NOT EXISTS tweets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                created_at DATETIME NOT NULL
            );
        `,
    create: `INSERT INTO tweets (content, user_id, created_at) VALUES (?, ?, ?);`,
    findAll: `SELECT * FROM tweets;`,
};

const Users = {
    createTable: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME NOT NULL
        );
    `,
    create: `INSERT INTO users (name, email, created_at) VALUES (?, ?, ?);`,
    findAll: `SELECT * FROM users;`,
};

module.exports = {
    Tweets,
    Users,
};
```

そして、`index.js`を以下のように編集します。

```js:index.js {4-10}
db.serialize(() => {
    ...

    db.all(queries.Tweets.findAll, (err, rows) => {
        console.log(rows);
    });

    db.all(queries.Users.findAll, (err, rows) => {
        console.log(rows);
    });
});
```

`db.all`は、SQLを実行して結果を全て取得する関数です。

今回は**全てのツイート**と**全てのユーザー**を取得するので、`Tweets.findAll`と`Users.findAll`という名前にしました。

最後の引数`(err, row) => {}`は、コールバック関数と呼ばれるものです。
コールバック関数は、その処理が終わった後に実行される関数です。
今回は**取得する**という処理が終わったら、引数に渡される`row`を表示するようにしています。

これで、ツイート一覧やユーザー一覧を取得できるようになりました。

それでは実行してみましょう。（`database.db`を削除しておきましょう）

```bash
node index.js
```

```txt
null
[
    {
        id: 1,
        content: 'あけおめ！',
        user_id: 3,
        created_at: '2023-01-01 00:00:00'
    },
    ...
]
null
[
    {
        id: 1,
        name: 'りんご太郎',
        email: 'apple@example.com',
        created_at: '2022-08-15 00:00:00'
    },
    ...
]
```

と表示されれば成功です。

またコミットしておきましょう。

```bash
git add .
git commit -m "ツイート一覧やユーザー一覧を取得できるようにする"
```

### ユーザーとツイートを紐付けて取得する

次に、ユーザーとツイートを紐付ける機能を作成してみましょう。
前回やった、「ツイート`id=1`のツイートを投稿したユーザーは誰でしょうか？」という問題を表現します。
ただ、名前以外も欲しいので、ユーザーの情報を全て取得することにします。

これを実現するSQLは

```sql
SELECT * FROM users WHERE id = (SELECT user_id FROM tweets WHERE id = 1);
```

となります。
前回のクエリで`name`だけを取得していたので、今回は`*`を使って全ての情報を取得します。

これを`queries.js`に追加します。

```js:queries.js {12}
const Users = {
    createTable: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME NOT NULL
        );
    `,
    create: `INSERT INTO users (name, email, created_at) VALUES (?, ?, ?);`,
    findAll: `SELECT * FROM users;`,
    findByTweetId: `SELECT * FROM users WHERE id = (SELECT user_id FROM tweets WHERE id = ?);`,
};
```

今回は**TweetId**から**User**を取得するので、`Users.findByTweetId`という名前にしました。

そして、`index.js`を以下のように編集します。

```js:index.js {4-10}
db.serialize(() => {
    ...

    db.get(queries.Users.findByTweetId, 1, (err, row) => {
        console.log(row);
    });

    db.get(queries.Users.findByTweetId, 4, (err, row) => {
        console.log(row);
    });
});
```

`db.all`は、SQLを実行して結果を全て取得する関数です。

このDB**ユーザー**と**ツイート**が`1:多`の関係になってます。
なのでツイートを書いたユーザーは必ず一人になります。
そのため、`db.get`を使っています。

それでは実行してみましょう。（`database.db`を削除しておきましょう）

```bash
node index.js
```

```txt
{
  id: 3,
  name: 'ぶどう三郎',
  email: 'budo@example.com',
  created_at: '2022-08-15 00:00:02'
}
undefined
```

と表示されれば成功です。
上の方はうまくいっているのがわかりますが、下の方は`undefined`が表示されています。
そうです、ツイート`id=4`は存在しないので、そういう時は`undefined`が返されることもわかりました。

またコミットしておきましょう。

```bash
git add .
git commit -m "ユーザーとツイートを紐付けて取得する"
```

ここまできてやっと操作は終わりです。

コミットログを見てみましょう。

```bash
git log --oneline
```

```txt
<id> (HEAD -> main) ユーザーとツイートを紐付けて取得する
<id> ツイート一覧やユーザー一覧を取得できるようにする
<id> ユーザーを作成できるようにする
<id> ユーザーとツイートのテーブルを作成
<id> データベースと接続する
```

このように、コミットログを見るだけでどのような機能を追加したかがわかるようになりました。

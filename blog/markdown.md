---
title: "Maximum Blog内のMarkdownの記法解説"
description: "Maximum Blog内で使われているMarkdown Rendererの記法解説をします。"
date: "2023-05-09"
authors: ["sor4chi"]
tags: ["markdown"]
---

## Heading

Headingは`#`を使って記述します。`#`の数が多いほど小さい見出しになります。
右側に表示される`TOC`は`h1`から`h3`までの見出しを表示します。
`h1`は上部に表示されるので、`h2`から記述するのを心がけましょう。

```txt
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

:::details[結果]

<!-- markdownlint-disable-next-line -->
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

:::

## Text

### Bold

Boldは`**`で囲むことで記述できます。

```txt
**Bold**
```

:::details[結果]
**Bold**
:::

### Italic

Italicは`*`で囲むことで記述できます。

```txt
*Italic*
```

:::details[結果]
*Italic*
:::

### Strikethrough

Strikethroughは`~~`で囲むことで記述できます。

```txt
~~Strikethrough~~
```

:::details[結果]
~~Strikethrough~~
:::

### Link

Linkは`[]()`で記述できます。

```txt
[Link](https://github.com)
```

:::details[結果]
[Link](https://github.com)
:::

### Image

Imageは`![]()`で記述できます。

```txt
![Image](/icon.png)
```

:::details[結果]
![Image](/icon.png)
:::

### Code(Inline)

Codeは`` ` ``で囲むことで記述できます。
文章中の一部をコードとして表示したい場合に使います。

```txt
今回は`VSCode`を使っています。
```

:::details[結果]
今回は`VSCode`を使っています。
:::

### Math(Inline)

MathはTex形式に対応しており、`$`で囲むことで記述できます。
文章中の一部を数式として表示したい場合に使います。

```txt
時間を$t$、位置を$x$とすると、$x$は$t$の関数$x(t)$で表されます。
```

:::details[結果]
時間を$t$、位置を$x$とすると、$x$は$t$の関数$x(t)$で表されます。
:::

### List

Listは`-`で記述できます。

```txt
- List1
- List2
- List3
```

:::details[結果]

- List1
- List2
- List3

:::

## Block

### Quote

Quoteは`>`で記述できます。
引用文を表示したい場合などに使います。

```txt
> 埼玉大学（さいたまだいがく、英語: Saitama University）は、 埼玉県さいたま市桜区下大久保255に本部を置く日本の国立大学。1873年創立、1949年大学設置。大学の略称は埼大（さいだい）。
```

:::details[結果]
> 埼玉大学（さいたまだいがく、英語: Saitama University）は、 埼玉県さいたま市桜区下大久保255に本部を置く日本の国立大学。1873年創立、1949年大学設置。大学の略称は埼大（さいだい）。
:::

### Table

Tableは`|`で記述できます。

```txt
| Header1 | Header2 | Header3 |
| ------- | ------- | ------- |
| Cell1   | Cell2   | Cell3   |
| Cell4   | Cell5   | Cell6   |
```

:::details[結果]
| Header1 | Header2 | Header3 |
| ------- | ------- | ------- |
| Cell1   | Cell2   | Cell3   |
| Cell4   | Cell5   | Cell6   |
:::

### Code(Block)

Code(Block)は`` ``` ``で囲むことで記述できます。
このリポジトリには表現統一のための[Markdownlint](https://github.com/DavidAnson/markdownlint)が導入されています。
そのため、Code(Block)の言語指定なしだとエラーが出ます。
txtを指定することでエラーを回避できます。

<!-- markdownlint-disable-next-line -->
~~~txt
```txt
Code
```
~~~

:::details[結果]

<!-- markdownlint-disable-next-line -->
```txt
Code
```

:::

またこのブログは[Prism.js](https://prismjs.com/)が内部で使用されています。したがって
Codeブロックの拡張構文が使用できます。

#### Language

言語を指定することで、その言語に特化したシンタックスハイライトが適用されます。

<!-- markdownlint-disable-next-line -->
~~~txt
```js
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log(fib(100)); // 354224848179262000000
```
~~~

:::details[結果]

```js
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log(fib(100)); // 354224848179262000000
```

:::

#### Line Highlight

行番号を指定することで、その行にハイライトが適用されます。

<!-- markdownlint-disable-next-line -->
~~~txt
```js{2-3,6}
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log(fib(100)); // 354224848179262000000
```
~~~

:::details[結果]

```js{2-3,6}
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log(fib(100)); // 354224848179262000000
```

:::

#### Line Numbers

行番号を表示することができます。

<!-- markdownlint-disable-next-line -->
~~~txt
```js showLineNumbers
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log(fib(100)); // 354224848179262000000
```
~~~

:::details[結果]

```js showLineNumbers
const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

console.log(fib(100)); // 354224848179262000000
```

:::

#### Diff Highlight

差分を表示することができます。

<!-- markdownlint-disable-next-line -->
~~~txt
```diff
- const fib = (n) => {
-   if (n <= 1) return n;
-   return fib(n - 1) + fib(n - 2);
- };
+ const memo = new Map();
+ const fib = (n) => {
+   if (n <= 1) return n;
+   if (memo.has(n)) return memo.get(n);
+   const result = fib(n - 1) + fib(n - 2);
+   memo.set(n, result);
+   return result;
+ };

console.log(fib(100)); // 354224848179262000000
```
~~~

:::details[結果]

```diff
- const fib = (n) => {
-   if (n <= 1) return n;
-   return fib(n - 1) + fib(n - 2);
- };
+ const memo = new Map();
+ const fib = (n) => {
+   if (n <= 1) return n;
+   if (memo.has(n)) return memo.get(n);
+   const result = fib(n - 1) + fib(n - 2);
+   memo.set(n, result);
+   return result;
+ };

console.log(fib(100)); // 354224848179262000000
```

:::

#### 拡張構文を組み合わせる

`diff-<言語名>`を指定することで、差分表示とシンタックスハイライトを組み合わせることができます。

<!-- markdownlint-disable-next-line -->
~~~txt
```diff-js{2-3,5,8,10} showLineNumbers
- const fib = (n) => {
-  if (n <= 1) return n;
-  return fib(n - 1) + fib(n - 2);
- };
+ const memo = new Map();
+ const fib = (n) => {
+  if (n <= 1) return n;
+  if (memo.has(n)) return memo.get(n);
+  const result = fib(n - 1) + fib(n - 2);
+  memo.set(n, result);
+  return result;
+ };

console.log(fib(100)); // 354224848179262000000
```
~~~

:::details[結果]

```diff-js{2-3,5,8,10} showLineNumbers
- const fib = (n) => {
-  if (n <= 1) return n;
-  return fib(n - 1) + fib(n - 2);
- };
+ const memo = new Map();
+ const fib = (n) => {
+  if (n <= 1) return n;
+  if (memo.has(n)) return memo.get(n);
+  const result = fib(n - 1) + fib(n - 2);
+  memo.set(n, result);
+  return result;
+ };

console.log(fib(100)); // 354224848179262000000
```

:::

### Math(Block)

MathはTex形式に対応しており、`$$`で囲むことで記述できます。
レンダリングには[KaTeX](https://katex.org/)が使用されています。

```txt
$$
\begin{equation}
F(x)= A_0 + \sum_{n=1}^N\left[ A_n\cos{\left(\frac{2\pi nx}{P}\right)}+B_n\sin{\left(\frac{2\pi nx}{P}\right)}\right] \notag
\end{equation}
$$
```

:::details[結果]
$$
\begin{equation}
F(x)= A_0 + \sum_{n=1}^N\left[ A_n\cos{\left(\frac{2\pi nx}{P}\right)}+B_n\sin{\left(\frac{2\pi nx}{P}\right)}\right] \notag
\end{equation}
$$
:::

### Details

Detailsは`:::details`で記述できます。
折りたたみ表示したい場合に使います。

```txt
:::details[結果]
Details
:::
```

:::details[結果]
:::details[結果]
Details

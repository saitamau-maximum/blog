---
title: "【第6回】累積和で高速処理をしてみよう"
description: "累積和という考え方を用いれば、部分的な区間における総和を高速に計算できます。まずは体験してみましょう。"
date: "2023-05-30"
authors: ["yukikamome316"]
tags: ["入門講習会", "algorithm", "atcoder", "競技プログラミング", "cpp"]
prev: "intro-course-5"
---

## 累積和で何ができるのか

適切な**前処理**をしておくことで、配列上の区間の総和を求める**クエリ**を爆速で処理できるようになります。

:::details[クエリとは？]

- `insert(i, x)`: リスト $i$ 番目に $x$ を代入する
- `sum(l, r)`: 区間 $[l,r)$ の要素の総和を出力する

といった、**命令文**のことです。

```sql
insert(1, 4)
insert(1, 3)
sum(1, 3)
insert(2, 6)
sum(2, 4)
```

このように、複数のクエリが与えらえることがあります。
:::

## 累積和を用いない実装

まずは素直な実装例を示します。

配列 $A$ の要素において、範囲 [left, right) の総和を知るためには、

```cpp
vector<int> A = {1, 2, 3, 4, 5, 6, 7};

int sum = 0;
for (int i = left; i < right; i++) {
    sum += A[i];
}
```

とすればよいです。この場合、計算量は $O(N)$ です。しかし、総和を求めさせるクエリが $Q$ 個飛んできた場合には、この処理を $Q$ 回繰り返すため、 $O(NQ)$ かかってしまいます。

:::details[範囲の指定方法について]
配列 $A$ の範囲を例えば [3, 7) と指定するとき、これは $(A_3,\ A_4,\ A_5,\ A_6)$ を表していて、

- 左側の $A_3$ は含める (**閉区間**)
- 右側の $A_7$ は含めない (**開区間**)

という状態でした。この範囲の指定方法はC++のSTLにも採用されている一般的な方法です。
:::

## 累積和を使って高速化してみる

全体の計算量が $O(NQ)$ では遅すぎるので、累積和を使ってクエリの処理を高速化してみましょう。

累積和とは、要素数 $N$ の配列 $A$ (0-indexed) に対して、

$$
\begin{equation}
s_i = \begin{cases}
   0 & (i = 0) \\
   \displaystyle \sum_{j = 0}^{i - 1} A_j & (i = 1,\  2,\  ...\ ,\  N)
\end{cases}

\notag
\end{equation}
$$

と定める配列 $s$ (0-indexed) のことです。つまり、

- $ s_0 = 0 $
- $ s_1 = A_0$
- $ s_2 = A_0 + A_1$
- $ s_3 = A_0 + A_1 + A_2$
- $ s_N = A_0 + A_1 + ... + A_{N - 1}$

となります。要素数は $N + 1$ です。

:::details[0-indexedって？]
特に配列の要素の位置(インデックス)において、

- 0から数え始めることを **0-based indexing (0-indexed)**

- 1から数え始めることを **1-based indexing (1-indexed)**

といいます。プログラミングにおいては、0-indexedであることが多いです。
:::

このとき、例えば 範囲 [3, 7) における総和を $s$ を用いて求めるには、

$s_7 = A_0 + A_1 + A_2 + A_3 + A_4 + A_5 + A_6$

$s_3 = A_0 + A_1 + A_2$

であることから、

$s_7 - s_3\ (= A_3 + A_4 + A_5 + A_6)$ を計算するだけで簡単に求められます！

そして、この計算量は $O(1)$ です。

まとめると、配列 $A$ の区間 [left, right) の総和は
$s_\mathrm{right} - s_\mathrm{left}$ で求まります。
また、 $s_0 = 0$ と定めたことで、 $\mathrm{left} = 0$ としても値が計算できるようになっています。

## 累積和の実装

配列 $s$ は要素数が $N$ で、

- $s_0 = 0$
- $s_1 = A_0$
- $s_2 = A_0 + A_1$
- $s_3 = A_0 + A_1 + A_2$
- $s_N = A_0 + A_1 + ... + A_{N - 1}$

と定められていました。ここで、 $s_{i + 1} = s_i + A_i$ であることに注目すると、計算量が更に減ります。

```cpp showLineNumbers
vector<int> A = {1, 2, 3, 4, 5, 6, 7};

const size_t N = A.size();
vector<int> s(N + 1, 0);    // s[0] == 0 となる

for (int i = 0; i < N; i++)
    s[i + 1] = s[i] + A[i];

// s = {0, 1, 3, 6, 10, 15, 21, 28}

int left = 3, right = 7;
cout << s[right] - s[left] << endl; // 22
```

配列 $s$ の前処理に $O(N)$ かかりますが、部分和を $O(1)$ で計算出来ていることが分かると思います。

:::details[累積和の発展的な用法]
累積和の考え方は、2次元配列にも適応することができます。

[ABC005: D - おいしいたこ焼きの焼き方](https://atcoder.jp/contests/abc005/tasks/abc005_4)
を参考にしてみてください。
:::

## 全処理に累積の考え方を使うケース

累積和の他にも、累積の考え方は

- 累積積
- 累積Max/Min
- 累積GCD
- 累積XOR

などに応用することができます。

### 累積Max/Min

要素数 $N$ の配列 $\{A_i\} \subset \mathbb{N}$ (0-indexed) に対して、

$$
\begin{equation}
s_i = \begin{cases}
   -1 & (i = 0) \\
   \displaystyle \max_{0 \leq j \leq i - 1} A_j & (i = 1,\  2,\  ...\ ,\  N)
\end{cases}

\notag
\end{equation}
$$

と配列 $s$ (0-indexed) を定めれば、区間 [0, i) における配列 $A$ の最大値が `s[i]` と求められます。

最小値についても同様に計算できます。

## 練習してみよう

### 問題1: [ABC037: C - 総和](https://atcoder.jp/contests/abc037/tasks/abc037_c)

#### 問題文

長さ $N$ の数列 $\{a_i\}$ と $1$ 以上 $N$ 以下の整数 $K$ が与えられます。この数列には長さ $K$ の連続する部分列が $N − K + 1$ 個あります。これらのそれぞれ部分列に含まれる値の合計の総和を求めてください。

#### 制約

- $1 \leq K \leq N \leq 10^5$
- $0 \leq a_i \leq 10^8$
- $a_i$ は整数である。

#### 部分点

$50$ 点分のテストケースでは、 $N \leq 10^3$ である。

:::details[ヒント]
まずは部分点を取れるようにプログラムを組んでみましょう。for文を用いて問題文の通りに実装すれば解けるはずです。その後、計算量を見積もってみましょう。
:::

:::details[部分点が得られる解答例]

```cpp showLineNumbers
#include <bits/stdc++.h>
#define rep(i, n) for (int i = 0; i < (int)(n); i++)
#define rep2(i, s, n) for (int i = (int)s; i < (int)(n); i++)
using namespace std;
using ll = long long;

int main() {
    int N, K;
    cin >> N >> K;
    vector<int> a(N);
    rep(i, N) cin >> a[i];

    ll sum = 0;
    rep(i, N - K + 1) {
        rep(j, K) {
            sum += a[i + j];
        }
    }

    cout << sum << endl;
}
```

:::

:::details[解答例]

```cpp showLineNumbers
#include <bits/stdc++.h>
#define rep(i, n) for (int i = 0; i < (int)n; i++)
#define rep2(i, s, n) for (int i = (int)s; i < (int)n; i++)
using namespace std;
using ll = long long;

int main() {
    int N, K; cin >> N >> K;
    vector<ll> a(N); rep(i, N) cin >> a[i];

    vector<ll> s(N + 1, 0);
    rep(i, N) s[i + 1] = s[i] + a[i];
    
    ll result = 0;
    rep(i, N - K + 1)
        result += s[i + K] - s[i];
    
    cout << result << endl;
}
```

:::

### 問題2: [ABC134: C - Exception Handling](https://atcoder.jp/contests/abc134/tasks/abc134_c)

#### 問題文

長さ $N$ の数列 $A_1,\ A_2,\ ...\ ,\ A_N$ が与えられます。 $1$ 以上 $N$ 以下の各整数 $i$ に対し、次の問いに答えてください。

- 数列中の $A_i$ を除く $N - 1$ 個の要素のうちの最大の値を求めよ。

#### 制約

- $2 \leq N \leq 200000$
- $1 \leq A_i \leq 200000$
- 入力中のすべての値は整数である。

:::details[ヒント]
配列の先頭と末尾からの2つの累積maxを保持すると、上手く実装できます。
:::

:::details[解答例]

- `s[i] := A[0] ～ A[i - 1]の最大値`
- `e[i] := A[N - i] ～ A[N - 1]の最大値`

と累積Maxを定めることによって、
$i$ 番目以外の最大値は `max(s[i], e[N - i - 1])` となる。

```cpp showLineNumbers
#include <bits/stdc++.h>
#define rep(i, n) for (int i = 0; i < (int)(n); i++)
#define rep2(i, s, n) for (int i = (int)s; i < (int)(n); i++)
using namespace std;
using ll = long long;

int main() {
    int N;
    cin >> N;
    vector<int> A(N);
    rep(i, N) cin >> A[i];

    vector<int> s(N + 1, -1), e(N + 1, -1);
    rep(i, N) s[i + 1] = max(s[i], A[i]);
    rep(i, N) e[i + 1] = max(e[i], A[N - i - 1]);

    rep(i, N)
        cout << max(s[i], e[N - i - 1]) << endl;
}
```

:::

### 問題3: [AOJ 0516 - 最大の和 (JOI 2006 本選 A)](https://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=0516)

#### 問題文

$n$ 個の整数からなる数列 $a_1,\ a_2,\ ...\ ,\ a_n$ と正整数 $k$ $(1 \leq k \leq n)$ が与えられる。このとき、連続して並ぶ $k$ 個の整数の和 $S_i = a_i + a_{i + 1} + ... + a_{i+ k-1}\ (1 \leq i \leq n - k + 1)$ の最大値を出力するプログラムを作りなさい。

##### 入力

入力は複数のデータセットからなる。各~データセットは以下の形式で与えられる。入力は2つのゼロを含む行で終了する。

1行目には正整数 $n\ (1 \leq n \leq 100000)$ と正整数 $k \ (1 \leq k \leq n)$ がこの順に空白で区切られて書かれている。2行目以降の第 $1 + i$ 行目 $(1 \leq i \leq n)$ には、数列の $i$ 番目の項 $a_i\ (-10000 \leq a_i \leq 10000)$ が書かれている。採点用データのうち、配点の 60% 分は $n \leq 5000,\ k \leq 1000$ を満たす。

データセットの数は 5 を超えない。

#### 出力

データセットごとに $S_i$ の最大値を1行に出力する。

#### 入出力例

##### 入力例

```txt
5 3
2
5
-4
10
3
0 0
```

##### 出力例

```txt
11
```

:::details[ヒント]
問題文を要約すると、

> $N$ 個の整数 $a_0,\ a_1,\ ...\ ,\ a_{N-1}$ が与えられる。 $K$ 個の連続する整数の和の最大値を求めよ。

となります。また、配列の最大値は`max`関数を用いて求められます。
:::

:::details[解答例]

```cpp showLineNumbers
#include <bits/stdc++.h>
#define rep(i, n) for (int i = 0; i < (int)(n); i++)
#define rep2(i, s, n) for (int i = (int)s; i < (int)(n); i++)
using namespace std;
using ll = long long;

int calcMaxOfPartialSums(int n, int k, vector<int> a) {
    vector<int> s(n + 1, 0);

    rep(i, n) s[i + 1] = s[i] + a[i];

    int result = INT_MIN;
    rep(i, n - k + 1) {
        result = max(result, s[i + k] - s[i]);
    }

    return result;
}

int main() {
    while (true) {
        int n, k;
        cin >> n >> k;
        if (n == 0 && k == 0) break;

        vector<int> a(n);
        rep(i, n) cin >> a[i];

        cout << calcMaxOfPartialSums(n, k, a) << endl;
    }
}
```

:::

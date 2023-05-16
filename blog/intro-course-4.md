---
date: "2023-05-16"
title: "【第4回】便利なデータ構造"
author: "takashin9"
tags: ["algorithm", "atcoder", "競技プログラミング", "cpp"]
layout: default
---



## STL のコンテナ

STLには以前紹介したように便利な関数がありました．今回は，便利なデータ構造を紹介します．

## まとめ
### map
- 連想配列や辞書と呼ばれるデータ構造
- `map`を用いると，特定の値にある値が紐付いているようなデータが扱える

### set
- 重複がない要素の集合を扱うデータ構造
- 数Aの集合と似ている

### queue
- キューや待ち行列と呼ばれるデータ構造
- `queue`を用いると，値を追加して，追加した順に値を取り出す処理ができる
- FIFO(First In First Out)先に入れたものが先に出てくる

### priority_queue
- 優先度付きキューと呼ばれるデータ構造
- `priority_queue`を用いると，追加した値のうち**大きい順**に取り出す処理ができる

### stack
- キューとは違い，後入れ先出し(LIFO)のデータ構造

### deque
- 両端キューと呼ばれるデータ構造
- `queue`の操作と`stack`の操作のどちらも行える
- 先頭と末尾に対して追加・削除が行える配列のようなもの

## map
- 連想配列や辞書と呼ばれるデータ構造
- `map`を用いると，特定の値にある値が紐付いているようなデータが扱える

`map`の宣言

`map<Keyの型, Valueの型> 変数名;`


| 操作           | 記法               | 計算量      |
| -------------- | ------------------ | ----------- |
| 値の追加       | `mp[key] = value;` | $O(\log N)$ |
| 値の削除       | `mp.erase(key);`   | $O(\log N)$ |
| 値へのアクセス | `mp.at(key)`       | $O(\log N)$ |
| 所属判定       | `mp.count(key)`    | $O(\log N)$ |
| 要素数の取得   | `mp.size()`        | $O(1)$      |
```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    map<char, int> mp; //宣言

    mp['A'] = 10; //'A'に対応する値として10を入れる
    mp['F'] = 15; //'F'に対応する値として15を入れる

    cout << mp.at('A') << endl; //10
    cout << mp.at('B') << endl; //'B'に対応する値を入れていないのでエラー

    cout << mp.size() << endl; //2

    cout << mp.count('A') << endl; //1(true)

    cout << mp['F'] <<  endl; //16
    cout << mp['G'] << endl; //0([]で存在しないkeyにアクセスしたときは0が追加される)
}
```

### 問題

<https://atcoder.jp/contests/apg4b/tasks/APG4b_bz>

### ヒント
<details>
<summary></summary>

値と出現回数を`map`で管理してみましょう
</details>


### 解答例
<details>
<summary></summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
  int N;
  cin >> N;
  vector<int> A(N);
  for (int i = 0; i < N; i++) {
    cin >> A.at(i);
  }

  map<int, int> cnt;
  for (int x : A) {
    if (cnt.count(x)) {
      // 既に含まれているならインクリメント
      cnt.at(x)++;
    } else {
      // 含まれていないなら、1を追加
      cnt[x] = 1;
    }
  }

  int max_cnt = 0;  // 出現回数の最大値を保持
  int ans = -1;     // 出現回数が最大になる値を保持
  for (int x : A) {
    // 今見ているxの出現回数が、その時点の最大よりも大きければ更新
    if (max_cnt < cnt.at(x)) {
      max_cnt = cnt.at(x);
      ans = x;
    }
  }

  cout << ans << " " << max_cnt << endl;
}
```
</details>


## set
- 重複がない要素の集合を扱うデータ構造
- 数Aの集合と似ている

`set`の宣言

`set<型> 変数名;`


| 操作         | 記法               | 計算量      |
| ------------ | ------------------ | ----------- |
| 値の追加     | `Set.insert(value)` | $O(\log N)$ |
| 値の削除     | `Set.erase(value)`  | $O(\log N)$ |
| 所属判定     | `Set.count(value)`  | $O(\log N)$ |
| 要素数の取得 | `Set.size()`        | $O(1)$      |
```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    set<int> Set;

    Set.insert(1);
    Set.insert(3);

    cout << Set.count(1) << endl; //1(true)
    cout << Set.size() << endl; //2
}
```

### 問題

<https://atcoder.jp/contests/abc211/tasks/abc211_b>

### ヒント
<details>
<summary></summary>

`set`に文字列をすべて挿入した場合，要素数はどうなりますか？
</details>



### 解答例
<details>
<summary></summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    //入力
    set<string> st;
    for (int i = 0; i < 4; i++) {
        string s;
        cin >> s;
        st.insert(s);
    }

    //出力
    cout << (st.size() == 4 ? "Yes" : "No") << endl;
}
```
</details>

## queue
- キューや待ち行列と呼ばれるデータ構造
- `queue`を用いると，値を追加して，追加した順に値を取り出す処理ができる
- FIFO(First In First Out)先に入れたものが先に出てくる

`queue`の宣言

`queue<型> 変数名;`



| 操作                   | 記法              | 計算量 |
| ---------------------- | ----------------- | ------ |
| 要素の追加             | `que.push(value)` | $O(1)$ |
| 先頭の要素へのアクセス | `que.front()`     | $O(1)$ |
| 先頭の要素を削除       | `que.pop()`       | $O(1)$ |
| 要素数の取得           | `que.size()`      | $O(1)$ |

### 問題文
<https://atcoder.jp/contests/atc002/tasks/abc007_3>
### ヒント
<details open>
<summary></summary>

幅優先探索の典型問題です．講習中は取り扱わないので，興味があれば解いてみてください．
</details>

### 解答例
<details>
<summary>もう少しきれいに実装できると思います...</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;


int main(){
    int r, c;
    cin >> r >> c;
    vector<vector<char>> board(r+1, vector<char>(c+1));
    pair<int, int> s, g;
    cin >> s.second >> s.first >> g.second >> g.first;
    for(int i = 1; i <= r; i++){
        for(int j = 1; j <= c; j++){
            cin >> board[i][j];
        }
    }
    int dx[4] = {1, 0, -1, 0};
    int dy[4] = {0, 1, 0, -1};
    vector<vector<int>> dist(r+1, vector<int>(c+1, -1));
    dist[s.second][s.first] = 0;
    queue<pair<int, int>> que;
    que.push(s);
    while(!que.empty()){
        pair<int, int> v = que.front();
        que.pop();
        for(int i = 0; i < 4; i++){
            int px = v.first + dx[i];
            int py = v.second + dy[i];
            if(dist[py][px] != -1 or board[py][px] == '#') continue;

            dist[py][px] = dist[v.second][v.first] + 1;
            que.push({px, py});
        }
    }
    cout << dist[g.second][g.first] << endl;
    
    
    return 0;
}
```
</details>

## priority_queue
- 優先度付きキューと呼ばれるデータ構造
- `priority_queue`を用いると，追加した値のうち**大きい順**に取り出す処理ができる

`priority_queue`の宣言

`priority_queue<型> 変数名;`


| 操作                   | 記法             | 計算量 |
| ---------------------- | ---------------- | ------ |
| 要素の追加             | `pq.push(value)` | $O(\log N)$ |
| 先頭の要素へのアクセス | `pq.front()`     | $O(1)$ |
| 先頭の要素を削除       | `pq.pop()`       | $O(\log N)$ |
| 要素数の取得           | `pq.size()`      | $O(1)$ |

値が小さい順に取り出される`priority_queue`の宣言

`priority_queue<型, vector<型>, greater<型>> 変数名;`
## stack
- キューとは違い，後入れ先出し(LIFO)のデータ構造

`stack`の宣言

`stack<型> 変数名;`


| 操作                   | 記法             | 計算量 |
| ---------------------- | ---------------- | ------ |
| 要素の追加             | `s.push(value)` | $O(1)$ |
| 先頭の要素へのアクセス | `s.top()`     | $O(1)$ |
| 先頭の要素を削除       | `s.pop()`       | $O(1)$ |
| 要素数の取得           | `s.size()`      | $O(1)$ |

### 問題文
<https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ay>

### ヒント
<details>
<summary></summary>

クエリの入力
```cpp
int q;
cin >> q;

while (q--) {
    int p;
    cin >> p;
    if (p == 1) {

    }
    if (p == 2) {
        
    }
    if (p == 3) {
        
    }
}
```
</details>

### 解答例
<details>
<summary></summary>

```cpp
#include <bits/stdc++.h>
using namespace std;


int main(){
    int q;
    cin >> q;
    stack<string> s;
    //for文でもいいけど，こういう書き方もある
    while (q--) {
        int p;
        cin >> p;
        if (p == 1) {
            string x;
            cin >> x;
            s.push(x);
        }
        if (p == 2) {
            cout << s.top() << endl;
        }
        if (p == 3) {
            s.pop();
        }
    }
    
    return 0;
}
```
</details>

## deque
- 両端キューと呼ばれるデータ構造
- `queue`の操作と`stack`の操作のどちらも行える
- 先頭と末尾に対して追加・削除が行える配列のようなもの

`deque`の宣言

`deque<型> 変数名;`

例

`deque<int> d;`


| 操作                   | 記法                                          | 計算量 |
| ---------------------- | --------------------------------------------- | ------ |
| 要素の追加             | `d.push_back(value)`<br>`d.push_front(value)` | $O(1)$ |
| 先頭の要素へのアクセス | `d.front()`<br>`d.back()`<br>`d.at(i)`        | $O(1)$ |
| 先頭の要素を削除       | `d.pop_back()`<br>`d.pop_front()`             | $O(1)$ |
| 要素数の取得           | `d.size()`<br>`d.empty()`                     | $O(1)$ |

### 問題文
<https://atcoder.jp/contests/abc291/tasks/abc291_b>

### ヒント
<details>
<summary></summary>

`deque`の入力は以下のようにできる
```cpp
int n;
cin >> n;
deque<int> d;
for (int i = 0; i < 5*n; i++) {
    int e;
    cin >> e;
    d.push_back(e);
}
```

`deque`のソートは`vector`と同様に`sort(d.begin(), d.end())`でできる

答えは`double`型になることに注意
</details>

### 解答例
<details>
<summary></summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    //入力
    int n;
    cin >> n;
    deque<int> d;
    for (int i = 0; i < 5*n; i++) {
        int e;
        cin >> e;
        d.push_back(e);
    }

    sort(d.begin(), d.end()); //ソートする

    //前と後ろのN個の要素を消す
    for (int i = 0; i < n; i++) {
        d.pop_back();
        d.pop_front();
    }
    double s = 0;
    for (int x : d) s += x; //sにすべて足す
    
    //おまじないをして出力
    cout << fixed << setprecision(15);
    cout << s / (3*n) << endl;
}
```
</details>
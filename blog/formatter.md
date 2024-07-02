---
title: "Maximum Blog のフォーマットを揃えよう"
description: "Maximum Blog でレビュー時にフォーマットが整っていないことがあるので、共通化したいです。"
date: "2024-07-02"
authors: ["a01sa01to"]
tags: ["markdown", "cpp"]
---

レビュー時に直すのたいへん！！なので、ある程度共通化したいです。
記事を書く人は目を通しておいてください。

適宜追記します + 気に入らなかったら変えてください

## Markdown のフォーマット

### アクセシビリティ的観点

- 見出しは `##` から `######` まで、レベルをちゃんと使い分けてください
  - 例えば、 `##` (h2) の直下に `####` (h4) 以降を置かないように
- リンクテキストは、リンク先の内容がわかるようにしてください
  - `詳細は [こちら](...)` といったものは NG です
- 画像には `alt` 属性をつけ、画像が指し示している情報を伝えるようにしてください
  - `![alt](src)` です

### 見た目的観点

- コードブロックは、言語を指定してください
  - cpp, js とか
- コピペできるようにするには、コードブロックにファイル名をつけてください

  ````text
  ```cpp:main.cpp
  #include <bits/stdc++.h>
  ```
  ````

  - 結果:

    ```cpp:main.cpp
    #include <bits/stdc++.h>
    ```

- 数式は `$` で囲ってください
  - `$$` で囲むと中央揃えになります
  - `$hoge$` はこんな感じ: $hoge$
  - 特に、 `log` は `\log` と書いてください
    - `log N`: $log N$
    - `\log N`: $\log N$
- コードの一部が文中に出てくる場合、 `inline code` として ` で囲ってください
  - 逆に、コードの一部分以外で強調したいなら `**` で囲いましょう。太字にできます

### その他

- 文字コードは UTF-8 にしましょう (大丈夫だと思うけど)
- ファイルの末尾には空白の行を入れましょう
- 各行の末尾にはスペースを入れないようにしましょう
- ~~全角文字と半角文字の間に半角スペースを入れましょう~~ (個人的な好みなので無視してもらって)

以下の VSCode 拡張機能を入れておくとよいです。 (VSCode で書いている人が多いと思うので)

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- [Trailing Spaces](https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces)

## コードブロックのフォーマット

### JS/TS

JS/TS は Format with... JS/TS Language Features でフォーマットするといいかんじになります。

### C++

以下の拡張機能を入れてください。入っているならそのままでよいです。

- [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

その後、 C++ ファイルをいじるプロジェクトルートディレクトリ (例えば競プロするときに VSCode で開くディレクトリ) に以下 `.clang-format` ファイルを置いてください。

```text:.clang-format
AccessModifierOffset: 0
AlignAfterOpenBracket: Align
AlignConsecutiveAssignments: None
AlignConsecutiveBitFields: None
AlignConsecutiveDeclarations: None
AlignConsecutiveMacros: None
AlignEscapedNewlines: DontAlign
AlignOperands: Align
AlignTrailingComments: true
AllowAllArgumentsOnNextLine: true
AllowAllConstructorInitializersOnNextLine: true
AllowAllParametersOfDeclarationOnNextLine: true
AllowShortBlocksOnASingleLine: Always
AllowShortCaseLabelsOnASingleLine: true
AllowShortEnumsOnASingleLine: true
AllowShortFunctionsOnASingleLine: All
AllowShortIfStatementsOnASingleLine: Always
AllowShortLambdasOnASingleLine: Empty
AllowShortLoopsOnASingleLine: true
AlwaysBreakAfterReturnType: None
AlwaysBreakBeforeMultilineStrings: true
AlwaysBreakTemplateDeclarations: MultiLine
BinPackArguments: true
BinPackParameters: true
BitFieldColonSpacing: After
BreakBeforeBinaryOperators: NonAssignment
BreakBeforeConceptDeclarations: false
BreakBeforeTernaryOperators: true
BreakConstructorInitializers: BeforeColon
BreakInheritanceList: BeforeColon
BreakStringLiterals: false
ColumnLimit: 0
CompactNamespaces: false
ConstructorInitializerAllOnOneLineOrOnePerLine: true
ConstructorInitializerIndentWidth: 2
ContinuationIndentWidth: 2
Cpp11BracedListStyle: false
DeriveLineEnding: true
DerivePointerAlignment: true
DisableFormat: false
EmptyLineBeforeAccessModifier: Always
IncludeBlocks: Regroup
IndentCaseBlocks: true
IndentCaseLabels: true
IndentExternBlock: Indent
IndentGotoLabels: true
IndentPPDirectives: BeforeHash
IndentRequires: true
IndentWidth: 2
IndentWrappedFunctionNames: true
KeepEmptyLinesAtTheStartOfBlocks: false
Language: Cpp
MaxEmptyLinesToKeep: 1
NamespaceIndentation: All
PointerAlignment: Left
ReflowComments: false
SortIncludes: true
SortUsingDeclarations: true
SpaceAfterCStyleCast: true
SpaceAfterLogicalNot: false
SpaceAfterTemplateKeyword: false
SpaceAroundPointerQualifiers: Default
SpaceBeforeAssignmentOperators: true
SpaceBeforeCaseColon: false
SpaceBeforeCpp11BracedList: true
SpaceBeforeCtorInitializerColon: false
SpaceBeforeInheritanceColon: false
SpaceBeforeParens: ControlStatements
SpaceBeforeRangeBasedForLoopColon: true
SpaceBeforeSquareBrackets: false
SpaceInEmptyBlock: false
SpaceInEmptyParentheses: false
SpacesBeforeTrailingComments: 2
SpacesInAngles: false
SpacesInCStyleCastParentheses: false
SpacesInConditionalStatement: false
SpacesInParentheses: false
SpacesInSquareBrackets: false
Standard: Auto
UseCRLF: false
UseTab: Never
BreakBeforeBraces: Custom
BraceWrapping:
  AfterCaseLabel: false
  AfterClass: false
  AfterControlStatement: Never
  AfterEnum: true
  AfterFunction: false
  AfterNamespace: false
  AfterStruct: false
  AfterUnion: false
  AfterExternBlock: false
  BeforeCatch: true
  BeforeElse: true
  BeforeLambdaBody: false
  BeforeWhile: false
  IndentBraces: false
  SplitEmptyFunction: false
  SplitEmptyRecord: false
  SplitEmptyNamespace: false
```

ファイル名の通り、 C 言語のフォーマットを指定しています。
気に入らなかったら適宜変えてください。
「clang-format configurator」とか検索すれば、 GUI で設定できるツールが出てきます。

次に、 VSCode の設定ファイルに以下を追加してください。

```json:settings.json
{
  "C_Cpp.clang_format_style": "file",
}
```

これでフォーマットできるようになるはずです。

適当に以下のようにフォーマットされていないコードを書いて、 `Ctrl + Shift + P` から Format document with... C/C++ でフォーマットしてみてください。

```cpp:before.cpp
#include<bits/stdc++.h>
using     namespace std;
int main(){
for(int i=0; i<10;i++){puts("Hello, World!" );
  }
}
```

```cpp:after.cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
  for (int i = 0; i < 10; i++) {
    puts("Hello, World!");
  }
}
```

### その他の言語

基本的に、

- インデントはちゃんとしよう
- 演算子 (`+`, `-` とか) の前後はスペースを入れよう
- カンマの後ろにはスペースを入れよう
- セミコロンの後ろにはスペースを入れよう
- `()` の中にはスペースは入れなくて OK

といった感じで。
C++ のほうを参考にしてください。

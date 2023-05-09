export const ERROR = {
  /** Markdown Parser Error */
  MARKDOWN_PARSER: {
    FRONTMATTER_NOT_FOUND: "Frontmatterが見つかりませんでした。",
    FRONTMATTER_SCHEMA_ERROR: "Frontmatterが不正な形式です。",
    FRONTMATTER_PARSE_ERROR: "Frontmatterのパースに失敗しました。",
    FRONTMATTER_CORRECT_FORMAT: `次のような形式になっている必要があります。
---
title: "タイトル"
description: "説明"
date: "2021-01-01"
authors: ["author1", "author2"]
tags: ["tag1", "tag2"]
---
`.trim(),
    FRONTMATTER_TITLE_REQUIRED: "titleが必要です。",
    FRONTMATTER_DESCRIPTION_REQUIRED: "descriptionが必要です。",
    FRONTMATTER_DATE_REQUIRED: "dateが必要です。",
    FRONTMATTER_DATE_FORMAT:
      'dateはYYYY-MM-DD形式である必要があります。例) date: "2021-01-01"',
    FRONTMATTER_AUTHORS_REQUIRED: "authorsが必要です。",
    FRONTMATTER_AUTHORS_LEAST_ONE: "authorsは1人以上必要です。",
    FRONTMATTER_TAGS_REQUIRED: "tagsが必要です。",
    FRONTMATTER_TAGS_LEAST_ONE: "tagsは1つ以上必要です。",
  },
};

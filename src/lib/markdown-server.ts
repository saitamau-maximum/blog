import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import refactorBash from 'refractor/lang/bash';
import refractorC from 'refractor/lang/c';
import refractorCpp from 'refractor/lang/cpp';
import refractorCSS from 'refractor/lang/css';
import refractorDiff from 'refractor/lang/diff';
import refractorGo from 'refractor/lang/go';
import refractorJava from 'refractor/lang/java';
import refractorJavascript from 'refractor/lang/javascript';
import refractorJson from 'refractor/lang/json';
import refractorJsx from 'refractor/lang/jsx';
import refractorPython from 'refractor/lang/python';
import refractorRust from 'refractor/lang/rust';
import refactorSql from 'refractor/lang/sql';
import refractorTsx from 'refractor/lang/tsx';
import refractorTypescript from 'refractor/lang/typescript';
import refactorHtml from 'refractor/lang/xml-doc';
import refractorYaml from 'refractor/lang/yaml';
import { refractor } from 'refractor/lib/core.js';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypePrismGenerator from 'rehype-prism-plus/generator';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkCodeTitle from 'remark-flexible-code-titles';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { z } from 'zod';

import { ERROR } from '@/constants/error';
import { URL } from '@/constants/url';

import remarkCustomDirectives from './remark/directive';

refractor.register(refractorRust);
refractor.register(refractorTypescript);
refractor.register(refractorJavascript);
refractor.register(refractorJsx);
refractor.register(refractorTsx);
refractor.register(refractorPython);
refractor.register(refractorJava);
refractor.register(refractorC);
refractor.register(refractorCpp);
refractor.register(refractorGo);
refractor.register(refractorDiff);
refractor.register(refractorJson);
refractor.register(refactorHtml);
refractor.register(refractorCSS);
refractor.register(refactorBash);
refractor.register(refactorSql);
refractor.register(refractorYaml);

const rehypePrism = rehypePrismGenerator(refractor);

const mdHtmlProcessor = unified()
  .use(remarkParse) //            [md    -> mdast] Markdownをmdast(Markdown抽象構文木)に変換
  .use(remarkGfm) //              [mdast -> mdast] table等の拡張md記法変換
  .use(remarkMath) //             [mdast -> mdast] mathブロックを変換
  .use(remarkDirective) //        [mdast -> mdast] directiveブロックを変換
  .use(remarkCustomDirectives) // [mdast -> mdast] directiveブロックを拡張
  .use(remarkCodeTitle) //        [mdast -> mdast] codeブロックへタイトル等の構文拡張
  .use(remarkRehype) //           [mdast -> hast ] mdast(Markdown抽象構文木)をhast(HTML抽象構文木)に変換
  .use(rehypeMermaid, {
    strategy: 'inline-svg',
    mermaidConfig: {
      fontFamily: 'sans-serif, monospace',
    },
  }) //          [hast  -> hast ] mermaidブロックをmermaid.jsに対応
  .use(rehypeKatex) //            [mdast -> hast ] mathブロックをkatex.jsに対応
  .use(rehypePrism, {
    ignoreMissing: false,
  }) //                           [hast  -> hast ] codeブロックをPrism.jsに対応
  .use(rehypeSlug) //             [hast  -> hast ] Headingにid付与（Toc Anchor用）
  .use(rehypeStringify); //       [hast  -> html ] hast(HTML抽象構文木)をHTMLに変換

const tocProcessor = unified()
  .use(remarkParse) //      [md    -> mdast] Markdownをmdast(Markdown抽象構文木)に変換
  .use(remarkRehype) //     [mdast -> hast ] mdast(Markdown抽象構文木)をhast(HTML抽象構文木)に変換
  .use(rehypeSlug) //       [hast  -> hast ] Headingにid付与（Toc Anchor用）
  .use(rehypeExtractToc) // [hast  -> hast ] Tocを抽出
  .use(rehypeStringify); // [hast  -> html ] hast(HTML抽象構文木)をHTMLに変換

export const parseMarkdownToHTML = async (mdContent: string) => {
  const [content, toc] = await Promise.all([
    await mdHtmlProcessor.process(mdContent),
    await tocProcessor.process(mdContent),
  ]);
  return {
    content: content.toString(),
    toc: toc.data.toc,
  };
};

const parseFrontmatter = (frontmatter: string) => {
  const wrappedFrontmatter = frontmatter
    .replace(/(\w+):/g, '"$1":')
    .replace(/\n/g, ',\n');
  try {
    const jsonFrontmatter = JSON.parse(`{${wrappedFrontmatter}}`);
    return jsonFrontmatter;
  } catch (e) {
    return null;
  }
};

const frontmatterRegex = /^---\n([\s\S]+?)\n---\n/;

const frontmatterSchema = z.object({
  title: z.string({
    required_error: ERROR.MARKDOWN_PARSER.FRONTMATTER_TITLE_REQUIRED,
  }),
  description: z.string({
    required_error: ERROR.MARKDOWN_PARSER.FRONTMATTER_DESCRIPTION_REQUIRED,
  }),
  date: z
    .string({
      required_error: ERROR.MARKDOWN_PARSER.FRONTMATTER_DATE_REQUIRED,
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/g, {
      message: ERROR.MARKDOWN_PARSER.FRONTMATTER_DATE_FORMAT,
    }),
  authors: z
    .array(z.string(), {
      required_error: ERROR.MARKDOWN_PARSER.FRONTMATTER_AUTHORS_REQUIRED,
    })
    .min(1, {
      message: ERROR.MARKDOWN_PARSER.FRONTMATTER_AUTHORS_LEAST_ONE,
    }),
  tags: z
    .array(z.string(), {
      required_error: ERROR.MARKDOWN_PARSER.FRONTMATTER_TAGS_REQUIRED,
    })
    .min(1, {
      message: ERROR.MARKDOWN_PARSER.FRONTMATTER_TAGS_LEAST_ONE,
    }),
  next: z.string().optional(),
  prev: z.string().optional(),
});

type Frontmatter = z.infer<typeof frontmatterSchema>;

export const parseStrToMarkdown = (
  str: string,
  filepath: string,
): { frontmatter: Frontmatter; content: string } => {
  const re = new RegExp(`^${URL.BLOG_DIR_PATH}/tag*`);
  if (re.test(filepath)) {
    throw new Error(
      `[${filepath}] ${ERROR.MARKDOWN_PARSER.TAG_MD_NOT_ALLOWED}`,
    );
  }

  const frontmatter = frontmatterRegex.exec(str);
  if (!frontmatter) {
    throw new Error(
      `[${filepath}] ${ERROR.MARKDOWN_PARSER.FRONTMATTER_NOT_FOUND}`,
    );
  }
  const jsonFrontmatter = parseFrontmatter(frontmatter[1]);
  if (!jsonFrontmatter) {
    throw new Error(
      `[${filepath}] ${ERROR.MARKDOWN_PARSER.FRONTMATTER_PARSE_ERROR} ${ERROR.MARKDOWN_PARSER.FRONTMATTER_CORRECT_FORMAT}`,
    );
  }
  const frontmatterData = frontmatterSchema.safeParse(jsonFrontmatter);
  if (!frontmatterData.success) {
    throw new Error(
      `[${filepath}] ${
        ERROR.MARKDOWN_PARSER.FRONTMATTER_SCHEMA_ERROR
      }\n${frontmatterData.error.issues
        .map((issue) => `- ${issue.message}`)
        .join('\n')}`,
    );
  }
  const content = str.replace(frontmatterRegex, '');
  return {
    frontmatter: frontmatterData.data,
    content,
  };
};

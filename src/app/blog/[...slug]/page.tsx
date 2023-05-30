import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "./page.module.css";
import { parseMarkdownToHTML, parseStrToMarkdown } from "@/lib/markdown";
import { access, readFile } from "fs/promises";
import path from "path";
import { Hero } from "@/components/hero";
import { AuthorList } from "@/components/blog/author-list";
import { TagList } from "@/components/blog/tag-list";
import { Toc } from "@/components/blog/toc";
import { Article } from "@/components/blog/article";
import { BlogButtonList } from "@/components/blog/button-list";
import { URL } from "@/constants/url";
import { BLOG_LIST_BREADCRUMBS } from "../page";
import { Navigation } from "@/components/blog/navigation";
import { findFilesInDeep } from "@/util/file";

interface Props {
  params: {
    slug: string[];
  };
}

const BLOG_DETAIL_BREADCRUMBS = (title: string, href: string) => [
  ...BLOG_LIST_BREADCRUMBS,
  {
    title,
    href,
  },
];

export async function generateStaticParams() {
  // もしblogディレクトリが存在しなければ空配列を返す
  try {
    await access(URL.BLOG_DIR_PATH);
  } catch (e) {
    return [];
  }

  // blogディレクトリ内のすべてのファイルを再帰的に探す
  const files = await findFilesInDeep(URL.BLOG_DIR_PATH, ".md");

  // ファイルの内容を取得
  const slugs = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(file, "utf-8");
      const res = parseStrToMarkdown(content, file);
      const relativePath = path.relative(URL.BLOG_DIR_PATH, file);
      const slugs = relativePath
        .split(path.sep)
        .map((slug) => slug.replace(/\.md$/, ""));
      return slugs;
    })
  );

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    authors: blog.meta.authors.map((author) => ({
      name: author,
      url: URL.GITHUB_PROFILE_URL(author),
    })),
  };
}
type ParsedMarkdown = ReturnType<typeof parseStrToMarkdown>;
type ParsedHTML = Awaited<ReturnType<typeof parseMarkdownToHTML>>;
type GetBlogResponseMeta = ParsedMarkdown["frontmatter"] & {
  slug: string[];
};

interface GetBlogResponse {
  body: ParsedHTML;
  meta: GetBlogResponseMeta;
  nextMeta?: GetBlogResponseMeta;
  prevMeta?: GetBlogResponseMeta;
}

const resolveNavigationPath = (baseFilePath: string, navPath: string) => {
  // 相対パスの場合の処理を書く
  // next = "./next-blog" の場合
  // ["blog", "2021", "08", "01", "next-blog"] という配列に変換する
  // next = "../../next-blog" の場合
  // ["blog", "2021", "next-blog"] という配列に変換する
  if (navPath.startsWith(".")) {
    const absolutePath = path.join(path.dirname(baseFilePath), navPath);
    const relativePath = path.relative(URL.BLOG_DIR_PATH, absolutePath);
    return relativePath.split("/");
  }

  // 絶対パスの場合の処理を書く
  // next = "/blog/2021/08/01/next-blog" の場合
  // ["blog", "2021", "08", "01", "next-blog"] という配列に変換する
  // next = "blog/2021/08/01/next-blog" の場合
  // ["blog", "2021", "08", "01", "next-blog"] という配列に変換する
  if (navPath.startsWith("/")) {
    return navPath.split("/").slice(1);
  } else {
    return navPath.split("/");
  }
};

async function getBlog(slug: string[], readSide = true) {
  const filepath = URL.BLOG_FILE_PATH(slug);
  const str = await readFile(filepath, "utf-8");
  const res = parseStrToMarkdown(str, filepath);
  if (!res) notFound();
  const parsed = await parseMarkdownToHTML(res.content);

  const blog: GetBlogResponse = {
    body: parsed,
    meta: {
      ...res.frontmatter,
      slug,
    },
  };
  if (res.frontmatter.next && readSide) {
    const nextSlug = resolveNavigationPath(filepath, res.frontmatter.next);
    const next = await getBlog(nextSlug, false);
    blog.nextMeta = next.meta;
  }
  if (res.frontmatter.prev && readSide) {
    const prevSlug = resolveNavigationPath(filepath, res.frontmatter.prev);
    const prev = await getBlog(prevSlug, false);
    blog.prevMeta = prev.meta;
  }

  return blog;
}

export default async function BlogDetail({ params }: Props) {
  const blog = await getBlog(params.slug);
  return (
    <>
      <Hero
        title={blog.meta.title}
        breadcrumbs={BLOG_DETAIL_BREADCRUMBS(
          blog.meta.title,
          `/blog/${blog.meta.slug}`
        )}
      >
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>{blog.meta.title}</h1>
            <p className={styles.description}>{blog.meta.description}</p>
            <TagList tags={blog.meta.tags} />
          </div>
          <div className={styles.heroRight}>
            <AuthorList authors={blog.meta.authors} />
          </div>
        </div>
      </Hero>
      <div className={styles.container}>
        <Article content={blog.body.content} />
        <aside className={styles.aside}>
          <div className={styles.stickies}>
            <div className={styles.toc}>
              <Toc toc={blog.body.toc} />
            </div>
            <BlogButtonList
              repositoryUrl={URL.GITHUB_REPOSITORY_BLOG_URL(blog.meta.slug)}
            />
          </div>
        </aside>
      </div>
      <div className={styles.navigation}>
        <Navigation next={blog.nextMeta} prev={blog.prevMeta} />
      </div>
    </>
  );
}

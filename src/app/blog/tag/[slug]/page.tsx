import type { Metadata } from "next";
import styles from "./page.module.css";
import { parseStrToMarkdown } from "@/lib/markdown";
import { readdir, readFile } from "fs/promises";
import { Hero } from "@/components/hero";
import { BlogCardList } from "@/components/blog/card-list";
import { URL } from "@/constants/url";
import { BLOG_LIST_BREADCRUMBS } from "../../page";

interface Props {
  params: {
    slug: string;
  };
}

const TITLE = (tag: string) => `「${tag}」 のブログ一覧`;
const DESCRIPTION = (tag: string) =>
  `${tag} のタグがついたブログ一覧です。\nサークルの公開している講習会資料や、技術のアウトプットなどを掲載しています。`;

const BLOG_LIST_FILTER_BY_TAG_BREADCRUMBS = (title: string, tag: string) => [
  ...BLOG_LIST_BREADCRUMBS,
  {
    title,
    href: `/blog/tag/${tag}`,
  },
];

export async function generateStaticParams() {
  const tags = await getTags();

  return tags.map((tag) => ({ slug: tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.slug);

  return {
    title: TITLE(tag),
    description: DESCRIPTION(tag),
  };
}

async function getTags() {
  const files = await readdir(URL.BLOG_DIR_PATH);
  const blogs = await Promise.all(
    files.map(async (file) => {
      const filePath = URL.BLOG_FILE_PATH(file);
      const content = await readFile(filePath, "utf-8");
      const res = parseStrToMarkdown(content, filePath);
      if (!res) return null;
      return {
        ...res.frontmatter,
        slug: file.replace(/\.md$/, ""),
      };
    })
  );
  const filteredBlogs = blogs.filter(
    (blog): blog is NonNullable<typeof blog> => blog !== null
  );
  const tags = filteredBlogs
    .map((blog) => blog.tags)
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index);

  return tags;
}

async function getBlogsByTag(tag: string) {
  const files = await readdir(URL.BLOG_DIR_PATH);
  const blogs = await Promise.all(
    files.map(async (file) => {
      const filePath = URL.BLOG_FILE_PATH(file);
      const content = await readFile(filePath, "utf-8");
      const res = parseStrToMarkdown(content, filePath);
      if (!res) return null;
      return {
        ...res.frontmatter,
        slug: file.replace(/\.md$/, ""),
      };
    })
  );

  const filteredBlogs = blogs.filter(
    (blog): blog is NonNullable<typeof blog> => blog !== null
  );
  const sortedBlogs = filteredBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const blogsByTag = sortedBlogs.filter((blog) => blog.tags.includes(tag));

  return blogsByTag;
}

export default async function BlogListByTag({ params }: Props) {
  const tagSlug = decodeURIComponent(params.slug);
  const blogs = await getBlogsByTag(tagSlug);

  return (
    <>
      <Hero
        breadcrumbs={BLOG_LIST_FILTER_BY_TAG_BREADCRUMBS(
          TITLE(tagSlug),
          params.slug
        )}
        information={`${blogs.length} posts`}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{TITLE(tagSlug)}</h1>
          <p className={styles.description}>{DESCRIPTION(tagSlug)}</p>
        </div>
      </Hero>
      <div className={styles.container}>
        <BlogCardList blogs={blogs} />
      </div>
    </>
  );
}

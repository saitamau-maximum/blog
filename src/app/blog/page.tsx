import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";

import { BlogCardList } from "@/components/blog/card-list";
import { Hero } from "@/components/hero";
import { URL } from "@/constants/url";
import { parseStrToMarkdown } from "@/lib/markdown";

import { HOME_BREADCRUMBS } from "../page";

import styles from "./page.module.css";

import type { Metadata } from "next";





const TITLE = "ブログ一覧";
const DESCRIPTION =
  "サークルの公開している講習会資料や、技術のアウトプットなどを掲載しています。";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
} satisfies Metadata;

export const BLOG_LIST_BREADCRUMBS = [
  ...HOME_BREADCRUMBS,
  {
    title: TITLE,
    href: "/blog",
  },
];

async function getBlogs() {
  if (!existsSync(URL.BLOG_DIR_PATH)) return [];
  const files = await readdir(URL.BLOG_DIR_PATH);
  const blogs = await Promise.all(
    files.map(async (file) => {
      const filePath = URL.BLOG_FILE_PATH(file);
      const content = await readFile(filePath, "utf-8");
      const res = parseStrToMarkdown(content, filePath);
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

  return sortedBlogs;
}

export default async function BlogList() {
  const blogs = await getBlogs();

  return (
    <>
      <Hero
        breadcrumbs={BLOG_LIST_BREADCRUMBS}
        information={`${blogs.length} posts`}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{TITLE}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>
        </div>
      </Hero>
      <div className={styles.container}>
        <BlogCardList blogs={blogs} />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import styles from "./page.module.css";
import { parseStrToMarkdown } from "@/lib/markdown";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { Hero } from "@/components/hero";
import { BlogCardList } from "@/components/blog/card-list";

const BLOGS_DIR_PATH = path.join(process.cwd(), "blog");

export const metadata = {
  title: "Blog",
  description: "Blog",
} satisfies Metadata;

async function getBlogs() {
  const files = await readdir(BLOGS_DIR_PATH);
  const blogs = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(BLOGS_DIR_PATH, file);
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

  return sortedBlogs;
}

export default async function BlogList() {
  const blogs = await getBlogs();

  return (
    <>
      <Hero>
        <h1>Blogs</h1>
      </Hero>
      <div className={styles.container}>
        <BlogCardList blogs={blogs} />
      </div>
    </>
  );
}

import Image from "next/image";
import styles from "./page.module.css";
import { TEXT } from "@/constants/text";
import { Hero } from "../components/hero";
import { readFile, readdir } from "fs/promises";
import { URL } from "@/constants/url";
import { parseStrToMarkdown } from "@/lib/markdown";
import { BlogCardList } from "@/components/blog/card-list";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

const LATEST_BLOGS_COUNT = 6;

export const HOME_BREADCRUMBS = [
  {
    title: "Home",
    href: "/",
  },
];

async function getLatestBlogs() {
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

  return sortedBlogs.slice(0, LATEST_BLOGS_COUNT);
}

export default async function Home() {
  const latestBlogs = await getLatestBlogs();

  return (
    <>
      <Hero breadcrumbs={HOME_BREADCRUMBS}>
        <div className={styles.heroContent}>
          <Image
            className={styles.heroIcon}
            src="/images/avatar.png"
            alt="Maximum's ICON"
            width={160}
            height={160}
          />
          <p className={styles.heroMessage}>{TEXT.TOP_WELCOME_MESSAGE}</p>
        </div>
      </Hero>
      <div className={styles.container}>
        <h2>新着記事</h2>
        <BlogCardList blogs={latestBlogs} />
        <Link href="/blog" className={styles.moreLink}>
          More
          <MdArrowForward />
        </Link>
      </div>
    </>
  );
}

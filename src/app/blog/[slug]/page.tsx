import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "./page.module.css";
import { parseMarkdownToHTML, parseStrToMarkdown } from "@/lib/markdown";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { Hero } from "@/components/hero";
import { AuthorList } from "@/components/blog/author-list";
import { TagList } from "@/components/blog/tag-list";
import { Toc } from "@/components/blog/toc";
import { Article } from "@/components/blog/article";
import { BlogButtonList } from "@/components/blog/button-list";
import { URL } from "@/constants/url";

interface Props {
  params: {
    slug: string;
  };
}

const BLOGS_DIR_PATH = path.join(process.cwd(), "blog");

export async function generateStaticParams() {
  const files = await readdir(BLOGS_DIR_PATH);
  const slugs = await Promise.all(
    files.map(async (file) => {
      const fp = path.join(BLOGS_DIR_PATH, file);
      const RELATIVE_PATH = path.relative(BLOGS_DIR_PATH, path.dirname(fp));
      const slug = path.join(RELATIVE_PATH, path.basename(fp, ".md"));
      const connectedSlug = slug.replace(path.sep, "-");
      return connectedSlug;
    })
  );

  return slugs.map((slug) => ({ params: { slug } }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog.meta.title,
    description: blog.meta.description,
    authors: blog.meta.authors.map((author) => ({
      name: author,
      url: `https://github.com/${author}`,
    })),
  };
}

async function getBlog(slug: string) {
  const filename = `${slug}.md`;
  const fp = path.join(BLOGS_DIR_PATH, filename);
  const str = await readFile(fp, "utf-8");
  const res = parseStrToMarkdown(str, filename);
  if (!res) notFound();

  return {
    body: {
      ...parseMarkdownToHTML(res.content),
    },
    meta: {
      ...res.frontmatter,
      slug,
    },
  };
}

export default async function BlogDetail({ params }: Props) {
  const blog = await getBlog(params.slug);

  return (
    <>
      <Hero title={blog.meta.title}>
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
    </>
  );
}

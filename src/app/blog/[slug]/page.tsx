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
import { BLOG_LIST_BREADCRUMBS } from "../page";
import { Navigation } from "@/components/blog/navigation";
import { get } from "http";

interface Props {
    params: {
        slug: string;
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
    const files = await readdir(URL.BLOG_DIR_PATH);
    const slugs = await Promise.all(
        files.map(async (file) => {
            const filepath = URL.BLOG_FILE_PATH(file);
            const RELATIVE_PATH = path.relative(
                URL.BLOG_DIR_PATH,
                path.dirname(filepath)
            );
            const slug = path.join(
                RELATIVE_PATH,
                path.basename(filepath, ".md")
            );
            const connectedSlug = slug.replace(path.sep, "-");
            return connectedSlug;
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

async function getBlog(slug: string, readSide = true) {
    const filename = `${slug}.md`;
    const filepath = URL.BLOG_FILE_PATH(filename);
    const str = await readFile(filepath, "utf-8");
    const res = parseStrToMarkdown(str, filename);
    if (!res) notFound();
    const parsed = await parseMarkdownToHTML(res.content);
    let nextMeta = {
        meta: { title: "", slug: "", description: "", date: "" },
    };
    let prevMeta = {
        meta: { title: "", slug: "", description: "", date: "" },
    };

    if (res.frontmatter.next && readSide) {
        const next = (await getBlog(res.frontmatter.next, false)) as any;
        nextMeta = next;
    }
    if (res.frontmatter.prev && readSide) {
        const prev = (await getBlog(res.frontmatter.prev, false)) as any;
        prevMeta = prev;
    }

    return {
        body: {
            ...parsed,
        },
        meta: {
            ...res.frontmatter,
            slug,
        },
        nextMeta,
        prevMeta,
    };
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
                        <p className={styles.description}>
                            {blog.meta.description}
                        </p>
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
                            repositoryUrl={URL.GITHUB_REPOSITORY_BLOG_URL(
                                blog.meta.slug
                            )}
                        />
                    </div>
                </aside>
            </div>
            <div className={styles.navigation}>
                <Navigation
                    next={{
                        title: blog.nextMeta?.meta.title || "",
                        slug: blog.nextMeta?.meta.slug || "",
                        description: blog.nextMeta?.meta.description || "",
                        date: blog.nextMeta?.meta.date || "",
                    }}
                    prev={{
                        title: blog.prevMeta?.meta.title || "",
                        slug: blog.prevMeta?.meta.slug || "",
                        description: blog.prevMeta?.meta.description || "",
                        date: blog.prevMeta?.meta.date || "",
                    }}
                />
            </div>
        </>
    );
}

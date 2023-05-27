import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "./page.module.css";
import { parseMarkdownToHTML, parseStrToMarkdown } from "@/lib/markdown";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
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
import { createOgp } from "@/lib/ogp";

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
    const slug = params.slug.replace(/-/g, "/");
    const title = blog.meta.title;
    const jsonPath = path.join(URL.BLOG_CACHE_DIR_PATH, "blog.json");
    const createJsonDir = async () => {
        try {
            await readdir(URL.BLOG_CACHE_DIR_PATH);
        } catch (e) {
            await mkdir(URL.BLOG_CACHE_DIR_PATH, { recursive: true });
        }
    };
    await createJsonDir();
    const jsonfile = await readdir(URL.BLOG_CACHE_DIR_PATH);
    if (!jsonfile.includes("blog.json")) {
        await writeFile(jsonPath, "{}");
    }


    let ogpPath = "images/ogp/generated/" + slug + ".png";
    const json = await readFile(jsonPath, "utf-8");
    const cache = JSON.parse(json);
    if (cache[slug] !== title) {
        ogpPath = await createOgp(
            blog.meta.title,
            blog.meta.authors,
            blog.meta.slug
        );
        cache[slug] = title;
        await writeFile(jsonPath, JSON.stringify(cache));
    }
    return {
        title: blog.meta.title,
        description: blog.meta.description,
        authors: blog.meta.authors.map((author) => ({
            name: author,
            url: URL.GITHUB_PROFILE_URL(author),
        })),
        openGraph: {
            images: [
                {
                    url: ogpPath,
                },
            ],
        },
    };
}
type ParsedMarkdown = ReturnType<typeof parseStrToMarkdown>;
type ParsedHTML = Awaited<ReturnType<typeof parseMarkdownToHTML>>;
type GetBlogResponseMeta = ParsedMarkdown["frontmatter"] & {
    slug: string;
};

interface GetBlogResponse {
    body: ParsedHTML;
    meta: GetBlogResponseMeta;
    nextMeta?: GetBlogResponseMeta;
    prevMeta?: GetBlogResponseMeta;
}

async function getBlog(slug: string, readSide = true) {
    const filename = `${slug}.md`;
    const filepath = URL.BLOG_FILE_PATH(filename);
    const str = await readFile(filepath, "utf-8");
    const res = parseStrToMarkdown(str, filename);
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
        const next = await getBlog(res.frontmatter.next, false);
        blog.nextMeta = next.meta;
    }
    if (res.frontmatter.prev && readSide) {
        const prev = await getBlog(res.frontmatter.prev, false);
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
                <Navigation next={blog.nextMeta} prev={blog.prevMeta} />
            </div>
        </>
    );
}

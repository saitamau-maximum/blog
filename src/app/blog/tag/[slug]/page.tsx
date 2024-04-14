import { existsSync } from 'fs';
import { access, readFile } from 'fs/promises';
import path from 'path';

import { BlogCardList } from '@/components/blog/card-list';
import { Hero } from '@/components/hero';
import { ROUTE } from '@/constants/route';
import { URL } from '@/constants/url';
import { parseStrToMarkdown } from '@/lib/markdown-server';
import { findFilesInDeep } from '@/util/file';

import styles from './page.module.css';

import type { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

const TITLE = (tag: string) => `「${tag}」 のブログ一覧`;
const DESCRIPTION = (tag: string) =>
  `${tag} のタグがついたブログ一覧です。\nサークルの公開している講習会資料や、技術のアウトプットなどを掲載しています。`;

const BREADCRUMBS = (title: string, tag: string) => [
  {
    title: 'Home',
    href: ROUTE.TOP,
  },
  {
    title: 'ブログ一覧',
    href: ROUTE.BLOG_LIST,
  },
  {
    title,
    href: ROUTE.TAGGED_BLOG_LIST(tag),
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
  if (!existsSync(URL.BLOG_DIR_PATH)) return [];
  const files = await findFilesInDeep(URL.BLOG_DIR_PATH, '.md');
  const blogs = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(file, 'utf-8');
      const res = parseStrToMarkdown(content, file);
      const relativePath = path.relative(URL.BLOG_DIR_PATH, file);
      const slugs = relativePath
        .split('/')
        .map((slug) => slug.replace(/\.md$/, ''));
      return {
        ...res.frontmatter,
        slug: slugs,
      };
    }),
  );
  const filteredBlogs = blogs.filter(
    (blog): blog is NonNullable<typeof blog> => blog !== null,
  );
  const tags = filteredBlogs
    .map((blog) => blog.tags)
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index);

  return tags;
}

async function getBlogsByTag(tag: string) {
  // もしblogディレクトリが存在しなければ空配列を返す
  try {
    await access(URL.BLOG_DIR_PATH);
  } catch (e) {
    return [];
  }

  // blogディレクトリ内のすべてのファイルを再帰的に探す
  const files = await findFilesInDeep(URL.BLOG_DIR_PATH, '.md');

  // ファイルの内容を取得
  const blogs = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(file, 'utf-8');
      const res = parseStrToMarkdown(content, file);
      const relativePath = path.relative(URL.BLOG_DIR_PATH, file);
      const slugs = relativePath
        .split('/')
        .map((slug) => slug.replace(/\.md$/, ''));
      return {
        ...res.frontmatter,
        slug: slugs,
      };
    }),
  );

  const filteredBlogs = blogs.filter(
    (blog): blog is NonNullable<typeof blog> => blog !== null,
  );
  const sortedBlogs = filteredBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
        breadcrumbs={BREADCRUMBS(TITLE(tagSlug), params.slug)}
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

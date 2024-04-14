import { readFile, access } from 'fs/promises';
import path from 'path';

import { BlogCardList } from '@/components/blog/card-list';
import { Hero } from '@/components/hero';
import { ROUTE } from '@/constants/route';
import { URL } from '@/constants/url';
import { parseStrToMarkdown } from '@/lib/markdown-server';
import { findFilesInDeep } from '@/util/file';

import styles from './page.module.css';

import type { Metadata } from 'next';

const TITLE = 'ブログ一覧';
const DESCRIPTION =
  'サークルの公開している講習会資料や、技術のアウトプットなどを掲載しています。';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
} satisfies Metadata;

const BREADCRUMBS = [
  {
    title: 'Home',
    href: ROUTE.TOP,
  },
  {
    title: TITLE,
    href: ROUTE.BLOG_LIST,
  },
];

async function getBlogs() {
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

  return sortedBlogs;
}

export default async function BlogList() {
  const blogs = await getBlogs();

  return (
    <>
      <Hero breadcrumbs={BREADCRUMBS} information={`${blogs.length} posts`}>
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

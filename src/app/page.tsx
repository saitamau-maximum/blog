import { existsSync } from 'fs';
import { access, readFile, readdir } from 'fs/promises';
import path from 'path';

import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';

import { BlogCardList } from '@/components/blog/card-list';
import { RelayList } from '@/components/relay/list';
import { ROUTE } from '@/constants/route';
import { TEXT } from '@/constants/text';
import { URL } from '@/constants/url';
import { parseStrToMarkdown } from '@/lib/markdown-server';
import { parseStrToRelay } from '@/lib/relay';
import { findFilesInDeep } from '@/util/file';

import { Hero } from '../components/hero';

import styles from './page.module.css';

const LATEST_BLOGS_COUNT = 6;
const LATEST_RELAYS_COUNT = 3;

export const HOME_BREADCRUMBS = [
  {
    title: 'Home',
    href: ROUTE.TOP,
  },
];

async function getLatestBlogs() {
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

  return sortedBlogs.slice(0, LATEST_BLOGS_COUNT);
}

async function getLatestRelays() {
  if (!existsSync(URL.RELAY_DIR_PATH)) return [];
  const files = await readdir(URL.RELAY_DIR_PATH);
  const relays = await Promise.all(
    files.map(async (file) => {
      const filePath = URL.RELAY_FILE_PATH(file);
      const content = await readFile(filePath, 'utf-8');
      return parseStrToRelay(content, filePath);
    }),
  );

  return relays
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, LATEST_RELAYS_COUNT)
    .map((relay) => ({
      slug: relay.slug,
      title: relay.title,
      description: relay.description,
      date: relay.date,
      authors: relay.blogs
        .map((blog) => blog.author)
        .filter(
          (author, i, self): author is NonNullable<typeof author> =>
            author !== null && self.indexOf(author) === i,
        ),
      reservedBlogCount: relay.blogs.filter((blog) => blog.author).length,
      postedBlogCount: relay.blogs.filter((blog) => blog.slug).length,
    }));
}

export default async function Home() {
  const latestBlogs = await getLatestBlogs();
  const latestRelays = await getLatestRelays();

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
        <p>
          サークルで講義に使った資料や、メンバーが得た知見をアウトプットしています。
        </p>
        <BlogCardList blogs={latestBlogs} />
        <Link href={ROUTE.BLOG_LIST} className={styles.moreLink}>
          More
          <MdArrowForward />
        </Link>
        <h2>直近のブログリレー</h2>
        <p>
          1ヶ月で1つのテーマについて、複数のメンバーが記事を書く企画「ブログリレー」を不定期に開催しています。
        </p>
        <RelayList relays={latestRelays} />
        <Link href={ROUTE.RELAY_LIST} className={styles.moreLink}>
          More
          <MdArrowForward />
        </Link>
      </div>
    </>
  );
}

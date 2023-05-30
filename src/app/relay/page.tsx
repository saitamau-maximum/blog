import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';

import { Hero } from '@/components/hero';
import { RelayList } from '@/components/relay/list';
import { URL } from '@/constants/url';
import { parseStrToRelay } from '@/lib/relay';

import { HOME_BREADCRUMBS } from '../page';

import styles from './page.module.css';

import type { Metadata } from 'next';

const TITLE = 'ブログリレー一覧';
const DESCRIPTION =
  '定期的に開催しているブログリレーを掲載しています。1ヶ月で1つのテーマについて、複数のメンバーが記事を書きます。';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
} satisfies Metadata;

export const RELAY_LIST_BREADCRUMBS = [
  ...HOME_BREADCRUMBS,
  {
    title: TITLE,
    href: '/relay',
  },
];

async function getRelays() {
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

export default async function RelayHome() {
  const relays = await getRelays();

  return (
    <>
      <Hero breadcrumbs={RELAY_LIST_BREADCRUMBS}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{TITLE}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>
        </div>
      </Hero>
      <div className={styles.container}>
        <RelayList relays={relays} />
      </div>
    </>
  );
}

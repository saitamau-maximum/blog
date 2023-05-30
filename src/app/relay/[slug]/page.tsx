import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

import {
  MdCalendarMonth,
  MdEditCalendar,
  MdEventAvailable,
  MdGroup,
} from 'react-icons/md';

import { Hero } from '@/components/hero';
import { RelayCalender } from '@/components/relay/calendar/calendar';
import { ProgressBar } from '@/components/relay/progress-bar/progress-bar';
import { URL } from '@/constants/url';
import { parseStrToRelay } from '@/lib/relay';
import { firstDayOfMonth, lastDayOfMonth } from '@/util/date';

import { RELAY_LIST_BREADCRUMBS } from '../page';

import styles from './page.module.css';

import type { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

const RELAY_DETAIL_BREADCRUMBS = (title: string, href: string) => [
  ...RELAY_LIST_BREADCRUMBS,
  {
    title,
    href,
  },
];

export async function generateStaticParams() {
  if (!existsSync(URL.RELAY_DIR_PATH)) return [];
  const files = await readdir(URL.RELAY_DIR_PATH);
  const slugs = await Promise.all(
    files.map(async (file) => {
      const filepath = URL.RELAY_FILE_PATH(file);
      const RELATIVE_PATH = path.relative(
        URL.RELAY_DIR_PATH,
        path.dirname(filepath),
      );
      const slug = path.join(RELATIVE_PATH, path.basename(filepath, '.json'));
      const connectedSlug = slug.replace(path.sep, '-');
      return connectedSlug;
    }),
  );

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const relay = await getRelay(params.slug);

  return {
    title: relay.title,
    description: relay.description,
    authors: relay.authors.map((author) => ({
      name: author,
      url: URL.GITHUB_PROFILE_URL(author),
    })),
  };
}

async function getRelay(slug: string) {
  const filename = `${slug}.json`;
  const filepath = URL.RELAY_FILE_PATH(filename);
  const str = await readFile(filepath, 'utf-8');
  const relay = parseStrToRelay(str, filename);

  return {
    slug: relay.slug,
    title: relay.title,
    description: relay.description,
    date: relay.date,
    blogs: relay.blogs,
    authors: relay.blogs
      .map((blog) => blog.author)
      .filter(
        (author, i, self): author is NonNullable<typeof author> =>
          author !== null && self.indexOf(author) === i,
      ),
    reservedBlogCount: relay.blogs.filter((blog) => blog.author).length,
    postedBlogCount: relay.blogs.filter((blog) => blog.slug).length,
  };
}

export default async function RelayDetail({ params }: Props) {
  const relay = await getRelay(params.slug);

  return (
    <>
      <Hero
        title={relay.title}
        breadcrumbs={RELAY_DETAIL_BREADCRUMBS(
          relay.title,
          `/relay/${relay.slug}`,
        )}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{relay.title}</h1>
          <p className={styles.description}>{relay.description}</p>
        </div>
      </Hero>
      <div className={styles.container}>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <MdCalendarMonth className={styles.metaItemIcon} />
            開催期間:
            <span className={styles.metaItemValue}>
              {firstDayOfMonth(relay.date)}
            </span>
            ~
            <span className={styles.metaItemValue}>
              {lastDayOfMonth(relay.date)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaItemBlock}>
              <MdGroup className={styles.metaItemIcon} />
              参加人数:
              <span className={styles.metaItemValue}>
                {relay.authors.length}
              </span>
              人
            </span>
            <span className={styles.metaItemBlock}>
              <MdEditCalendar className={styles.metaItemIcon} />
              予約済み:
              <span className={styles.metaItemValue}>
                {relay.reservedBlogCount}
              </span>
              日
            </span>
            <span className={styles.metaItemBlock}>
              <MdEventAvailable className={styles.metaItemIcon} />
              投稿済み:
              <span className={styles.metaItemValue}>
                {relay.postedBlogCount}
              </span>
              件
            </span>
          </div>
        </div>
        <div className={styles.progressDisplay}>
          <span className={styles.progressDisplayLabel}>達成率:</span>
          <ProgressBar
            progress={relay.postedBlogCount / (relay.reservedBlogCount || 1)}
          />
        </div>
        <div className={styles.scrollContainer}>
          <RelayCalender calenderDate={relay.date} relay={relay.blogs} />
        </div>
      </div>
    </>
  );
}

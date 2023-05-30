import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { MdEditCalendar, MdEventAvailable } from 'react-icons/md';

import { URL } from '@/constants/url';

import styles from './relay-list.module.css';

interface Props {
  relays: {
    slug: string;
    title: string;
    description: string;
    date: string;
    authors: string[];
    reservedBlogCount: number;
    postedBlogCount: number;
  }[];
}

const isThisMonth = (date: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return date.startsWith(`${year}-${month}`);
};

const isPastMonth = (date: string) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [year, month] = date.split('-').map((str) => parseInt(str, 10));

  if (currentYear > year) return true;
  if (currentYear === year && currentMonth > month) return true;
  return false;
};

export const RelayList = ({ relays }: Props) => {
  if (relays.length === 0) {
    return (
      <p className={styles.relayListEmptyMessage}>ブログリレーがありません。</p>
    );
  }

  return (
    <div className={styles.relayList}>
      {relays.map((relay, index) => (
        <div key={relay.slug} className={styles.relayListItem}>
          <div className={styles.relayListItemLeft}>
            <time
              className={clsx(
                styles.relayListItemDate,
                isThisMonth(relay.date) && styles.relayListItemDateActive,
              )}
            >
              {relay.date}
            </time>
            <div
              className={clsx(
                styles.relayListItemPoint,
                isThisMonth(relay.date) && styles.relayListItemPointActive,
              )}
            />
          </div>
          <div className={styles.relayListItemRight}>
            <Link
              className={styles.relayListItemCard}
              href={`/relay/${relay.slug}`}
            >
              <h2 className={styles.relayListItemTitle}>
                <span className={styles.relayListItemTitleText}>
                  {relay.title}
                </span>
                {isThisMonth(relay.date) && (
                  <span className={styles.relayListItemActive}>開催中</span>
                )}
                {isPastMonth(relay.date) && (
                  <span className={styles.relayListItemArchived}>開催済み</span>
                )}
              </h2>
              <p className={styles.relayListItemDescription}>
                {relay.description}
              </p>
              <p className={styles.relayListItemStatus}>
                <span className={styles.relayListItemStatusText}>
                  <MdEditCalendar className={styles.relayListItemStatusIcon} />
                  予約
                  <span className={styles.relayListItemStatusTextCount}>
                    {relay.reservedBlogCount}
                  </span>
                  件
                </span>
                <span className={styles.relayListItemStatusText}>
                  <MdEventAvailable
                    className={styles.relayListItemStatusIcon}
                  />
                  投稿
                  <span className={styles.relayListItemStatusTextCount}>
                    {relay.postedBlogCount}
                  </span>
                  件
                </span>
              </p>
              {relay.authors.length > 0 && (
                <p className={styles.memberList}>
                  {relay.authors.map((author) => (
                    <Image
                      className={styles.memberListItem}
                      key={author}
                      src={URL.GITHUB_PROFILE_IMAGE_URL(author)}
                      alt={author}
                      width={40}
                      height={40}
                    />
                  ))}
                </p>
              )}
            </Link>
          </div>
          {index !== relays.length - 1 && (
            <div className={styles.relayListItemLine}></div>
          )}
        </div>
      ))}
    </div>
  );
};

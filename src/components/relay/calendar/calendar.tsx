import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { URL } from "@/constants/url";

import styles from "./calendar.module.css";

type RelayItem = {
  slug: string | null;
  title: string | null;
  author: string | null;
  day: number;
};

interface Props {
  calenderDate: string;
  relay: RelayItem[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_LENGTH = WEEKDAYS.length;

export const RelayCalender = ({ calenderDate, relay }: Props) => {
  const sortedRelays = relay.sort((a, b) => {
    const aDate = new Date(a.day);
    const bDate = new Date(b.day);
    return aDate.getTime() - bDate.getTime();
  });

  const weeks = useMemo(() => {
    const thisMonth = new Date(calenderDate);
    const firstDay = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

    const firstDayOfWeek = firstDay.getDay();
    const lastDay = new Date(
      thisMonth.getFullYear(),
      thisMonth.getMonth() + 1,
      0
    );
    const lastDate = lastDay.getDate();

    const calendar: (RelayItem | null)[][] = [];
    let week: (RelayItem | null)[] = [];

    // 第１週目の1日より前の日付をnullで埋める
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }

    // 1日から月末までの日付をセット
    for (let i = 1; i <= lastDate; i++) {
      if (week.length === WEEK_LENGTH) {
        calendar.push(week);
        week = [];
      }
      const day = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), i);
      const relay = sortedRelays[day.getDate() - 1];
      week.push(relay || null);
    }

    // 最終週の月末より後の日付をnullで埋める
    for (let i = week.length; i < WEEK_LENGTH; i++) {
      week.push(null);
    }
    calendar.push(week);

    return calendar;
  }, [calenderDate, sortedRelays]);

  return (
    <table className={styles.calendarContainer}>
      <thead>
        <tr>
          {WEEKDAYS.map((weekday) => (
            <th
              key={weekday}
              className={clsx(
                styles.weekday,
                weekday === WEEKDAYS[0] && styles.sunday,
                weekday === WEEKDAYS[6] && styles.saturday
              )}
            >
              {weekday}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, index) => (
          <tr key={index} className={styles.week}>
            {week.map((relay, index) => (
              <td key={index} className={styles.day}>
                <div className={styles.dayNum}>{relay?.day}</div>
                <_CalenderCell relay={relay} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const _CalenderCell = ({ relay }: { relay: RelayItem | null }) => {
  if (!relay || !relay.author) return null;
  if (!relay.slug || !relay.title)
    return (
      <div className={clsx(styles.dayCell, styles.dayCellDeactive)}>
        <div className={styles.dayCard}>
          <div className={styles.dayCardAuthor}>
            <Image
              src={URL.GITHUB_PROFILE_IMAGE_URL(relay.author)}
              width={24}
              height={24}
              alt={relay.author}
              className={styles.dayCardAuthorAvatar}
            />
            {relay.author}
          </div>
          <div className={styles.dayCardTitle}>
            {relay.title || "タイトル未定"}
          </div>
        </div>
      </div>
    );

  return (
    <Link
      className={clsx(styles.dayCell, styles.dayCellLink)}
      href={`/blog/${relay.slug}`}
    >
      <div className={styles.dayCard}>
        <div className={styles.dayCardAuthor}>
          <Image
            src={URL.GITHUB_PROFILE_IMAGE_URL(relay.author)}
            width={24}
            height={24}
            alt={relay.author}
            className={styles.dayCardAuthorAvatar}
          />
          {relay.author}
        </div>
        <div className={styles.dayCardTitle}>{relay.title}</div>
      </div>
    </Link>
  );
};

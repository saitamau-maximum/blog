import Link from 'next/link';

import { ROUTE } from '@/constants/route';

import styles from './tag-list.module.css';

interface Props {
  tags: string[];
}

export const TagList = ({ tags }: Props) => {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tagItem}>
          <Link className={styles.tag} href={ROUTE.TAGGED_BLOG_LIST(tag)}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

import Image from "next/image";
import Link from "next/link";
import styles from "./tag-list.module.css";

interface Props {
  tags: string[];
}

const BLOG_LIST_BY_TAG_URL = (tag: string) => `/blog/tag/${tag}`;

export const TagList = ({ tags }: Props) => {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tagItem}>
          <Link className={styles.tag} href={BLOG_LIST_BY_TAG_URL(tag)}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

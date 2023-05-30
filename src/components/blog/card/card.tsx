import Image from "next/image";
import Link from "next/link";

import { URL } from "@/constants/url";

import styles from "./card.module.css";

interface Props {
  title: string;
  slug: string;
  date: string;
  authors: string[];
  tags: string[];
}

export const BlogCard = ({ title, slug, date, authors, tags }: Props) => {
  return (
    <div className={styles.card}>
      <Link href={`/blog/${slug}`} className={styles.cardLink}>
        <div className={styles.cardHeader}>
          <time className={styles.cardDate}>{date}</time>
          <div className={styles.cardAuthors}>
            {authors.map((author) => (
              <Image
                key={author}
                src={URL.GITHUB_PROFILE_IMAGE_URL(author)}
                alt={author}
                width={32}
                height={32}
                className={styles.cardAuthorImage}
              />
            ))}
          </div>
        </div>
        <h2 className={styles.cardTitle}>{title}</h2>
        <div className={styles.cardFooter}>
          <ul className={styles.cardTags}>
            {tags.map((tag) => (
              <li key={tag} className={styles.cardTagItem}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </div>
  );
};

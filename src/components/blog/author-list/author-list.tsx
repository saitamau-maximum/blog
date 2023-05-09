import Image from "next/image";
import Link from "next/link";
import styles from "./author-list.module.css";

interface Props {
  authors: string[];
}

const GITHUB_PROFILE_URL = (username: string) =>
  `https://github.com/${username}`;
const GITHUB_PROFILE_IMAGE_URL = (username: string) =>
  `https://github.com/${username}.png`;

export const AuthorList = ({ authors }: Props) => {
  return (
    <ul className={styles.authorList}>
      {authors.map((author) => (
        <li key={author} className={styles.authorItem}>
          <Link
            className={styles.author}
            href={GITHUB_PROFILE_URL(author)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={GITHUB_PROFILE_IMAGE_URL(author)}
              alt={author}
              width={48}
              height={48}
              className={styles.authorImage}
            />
            <span className={styles.authorName}>{author}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

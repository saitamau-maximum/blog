"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./author-list.module.css";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { URL } from "@/constants/url";

interface Props {
  authors: string[];
}

const MAX_DISPLAY_AUTHORS = 2;

export const AuthorList = ({ authors }: Props) => {
  const [displayMore, setDisplayMore] = useState(false);
  const displayAuthors = displayMore
    ? authors
    : authors.slice(0, MAX_DISPLAY_AUTHORS);

  return (
    <>
      <ul className={styles.authorList}>
        {displayAuthors.map((author) => (
          <>
            <li key={author} className={styles.authorItem}>
              <Link
                className={styles.author}
                href={URL.GITHUB_PROFILE_URL(author)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={URL.GITHUB_PROFILE_IMAGE_URL(author)}
                  alt={author}
                  width={48}
                  height={48}
                  className={styles.authorImage}
                />
                <span className={styles.authorName}>{author}</span>
              </Link>
            </li>
          </>
        ))}
      </ul>
      {!displayMore && authors.length > MAX_DISPLAY_AUTHORS && (
        <button
          className={styles.moreButton}
          onClick={() => setDisplayMore(true)}
        >
          more
          <MdExpandMore />
        </button>
      )}
    </>
  );
};

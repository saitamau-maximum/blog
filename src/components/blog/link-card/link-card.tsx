'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from './link-card.module.css';

import type { LinkMeta } from 'remark-link-meta/dist/types';

const getDomain = (url: string) => {
  const domain = url.match(/https?:\/\/([^/]+)/);
  return domain ? domain[1] : '';
};

interface Props {
  title: string;
  href: string;
  description?: LinkMeta['description'];
  thumbnailurl?: LinkMeta['thumbnailUrl'];
  iconurl?: LinkMeta['iconUrl'];
}

export const LinkCard = ({
  description,
  href,
  iconurl,
  thumbnailurl,
  title,
}: Props) => {
  const [isIconLoadSuccess, setIsIconLoadSuccess] = useState(true);
  const [isThumbnailLoadSuccess, setIsThumbnailLoadSuccess] = useState(true);

  return (
    <Link
      href={href}
      className={styles.container}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        <span className={styles.domain}>
          {isIconLoadSuccess && iconurl && (
            <Image
              src={iconurl}
              alt={title}
              width={16}
              height={16}
              onError={() => setIsIconLoadSuccess(false)}
              className={styles.icon}
            />
          )}
          {getDomain(href)}
        </span>
      </span>
      {isThumbnailLoadSuccess && thumbnailurl && (
        <Image
          src={thumbnailurl}
          alt={title}
          width={240}
          height={126}
          className={styles.thumbnail}
          onError={() => setIsThumbnailLoadSuccess(false)}
        />
      )}
    </Link>
  );
};

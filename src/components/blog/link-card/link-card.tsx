'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { URL as _URL } from '@/constants/url';

import styles from './link-card.module.css';

const getDomain = (url: string) => {
  if (url.startsWith('/')) {
    url = _URL.ORIGIN + url;
  }

  const match = url.match(/^https?:\/\/([^/]+)/);
  return match?.[1];
};

const getUnescapedText = (text: string) => {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
};

interface Props {
  href: string;
}
interface LinkData {
  title: string;
  description?: string;
  imageUrl?: string;
  faviconUrl?: string;
}

export const LinkCard = ({ href }: Props) => {
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const openInNewTab = href.startsWith('http');

  const fetchLinkData = useCallback(async () => {
    const reqUrl = (href.startsWith('/') ? _URL.ORIGIN : '') + href;
    const query = new URLSearchParams({ url: reqUrl });
    const response = await fetch(
      new URL(`/?${query}`, _URL.OGP_FETCHER_ORIGIN).toString(),
    );
    if (response.ok) {
      const data: LinkData = await response.json();
      setLinkData(data);
    }
  }, [href]);

  useEffect(() => {
    console.log('href', href);
    fetchLinkData();
  }, [fetchLinkData]);

  if (!linkData) return <div className={styles.container} />;

  return (
    <Link
      href={href}
      className={styles.container}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      target={openInNewTab ? '_blank' : undefined}
    >
      <span className={styles.content}>
        <span className={styles.title}>{getUnescapedText(linkData.title)}</span>
        {linkData.description && (
          <span className={styles.description}>
            {getUnescapedText(linkData.description)}
          </span>
        )}
        <span className={styles.domain}>
          {linkData.faviconUrl && (
            <Image
              src={linkData.faviconUrl}
              alt={linkData.title}
              width={16}
              height={16}
              className={styles.icon}
            />
          )}
          {getDomain(href)}
        </span>
      </span>
      {linkData.imageUrl && (
        <Image
          src={linkData.imageUrl}
          alt={linkData.title}
          width={240}
          height={126}
          className={styles.thumbnail}
        />
      )}
    </Link>
  );
};

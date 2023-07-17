import { clsx } from 'clsx';
import Link from 'next/link';
import { LinkMeta } from 'remark-link-meta';

import { LinkCard } from '@/components/blog/link-card';

import styles from './anchor.module.css';

import type { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<'a'> & {
  href: string;
  title?: LinkMeta['title'];
  description?: LinkMeta['description'];
  thumbnailurl?: LinkMeta['thumbnailUrl'];
  iconurl?: LinkMeta['iconUrl'];
};

export const Anchor = ({
  children,
  href,
  title,
  description,
  thumbnailurl,
  iconurl,
  ...rest
}: Props) => {
  if (href.startsWith('/')) {
    return (
      <Link
        href={href}
        passHref
        className={clsx(styles.anchor, rest.className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className={clsx(styles.anchor, rest.className)} {...rest}>
        {children}
      </a>
    );
  }

  if (title) {
    return (
      <LinkCard
        title={title}
        href={href}
        description={description}
        thumbnailurl={thumbnailurl}
        iconurl={iconurl}
      />
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.anchor, rest.className)}
      {...rest}
    >
      {children}
    </a>
  );
};

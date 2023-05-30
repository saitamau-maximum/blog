import { clsx } from 'clsx';
import Link from 'next/link';

import styles from './anchor.module.css';

import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & {
  href: string;
};

export const Anchor = ({ children, href, ...rest }: Props) => {
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

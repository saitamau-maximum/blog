'use client';
import { clsx } from 'clsx';
import Link from 'next/link';
import { Fragment, ReactNode, useEffect } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { MdHome } from 'react-icons/md';

import { useHeader } from '@/hooks';

import styles from './hero.module.css';

type BreadcrumbItem = {
  title: string;
  href: string;
};

interface Props {
  title?: string;
  children?: ReactNode;
  information?: string;
  breadcrumbs: BreadcrumbItem[];
}

export const Hero = ({ children, information, title, breadcrumbs }: Props) => {
  const { setTitle, heroAreaRef } = useHeader();
  title && setTitle(title);

  useEffect(() => {
    return () => {
      setTitle('');
    };
  }, [setTitle]);

  return (
    <>
      <div className={styles.hero} ref={heroAreaRef}>
        <div className={styles.heroBg} />
        {children}
      </div>
      <div className={styles.heroOuter}>
        <div className={styles.breadcrumbs}>
          <MdHome size={20} className={styles.breadcrumbItem} />
          {breadcrumbs.map((breadcrumb, index) => (
            <Fragment key={breadcrumb.href}>
              {index !== breadcrumbs.length - 1 ? (
                <Link
                  href={breadcrumb.href}
                  className={clsx(styles.breadcrumbItem, styles.link)}
                >
                  {breadcrumb.title}
                </Link>
              ) : (
                <span className={styles.breadcrumbItem}>
                  {breadcrumb.title}
                </span>
              )}
              {index !== breadcrumbs.length - 1 && (
                <IoIosArrowForward className={styles.breadcrumbItem} />
              )}
            </Fragment>
          ))}
        </div>
        <span className={styles.information}>{information}</span>
      </div>
    </>
  );
};

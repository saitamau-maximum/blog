'use client';
import { Toc as TocType, TocEntry } from '@stefanprobst/rehype-extract-toc';
import { clsx } from 'clsx';
import { useEffect, useRef } from 'react';

import styles from './toc.module.css';

const TocItem = ({ children, id, depth, value }: TocEntry) => {
  const observer = useRef<IntersectionObserver>();
  const toc = useRef<HTMLAnchorElement>(null);
  const targetId = `#${id}`;

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!toc.current) return;
        if (entry.isIntersecting) {
          toc.current.classList.add(styles.tocActive);
        } else {
          toc.current.classList.remove(styles.tocActive);
        }
      });
    });

    // probably, targetId starts with '#[0-9]', so try-catch is needed
    try {
      const heading = document.querySelector(targetId);
      if (heading && observer.current) {
        observer.current.observe(heading);
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <ul className={clsx(styles.tocWrapper, depth <= 2 && styles.tocTop)}>
      <li className={styles.tocItem}>
        <a href={targetId} className={styles.tocItemLink} ref={toc}>
          {value}
        </a>
      </li>
      {depth <= 2 &&
        children &&
        children.map((child) => <TocItem {...child} key={child.value} />)}
    </ul>
  );
};

export const Toc = ({ toc }: { toc?: TocType }) => {
  return (
    <section className={styles.tocList}>
      {!toc || (toc.length === 0 && <p>見出しがありません</p>)}
      {toc && toc.map((toc) => <TocItem {...toc} key={toc.value} />)}
    </section>
  );
};

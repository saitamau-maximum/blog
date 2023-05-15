"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import { Logo } from "./logo";
import { useHeader } from "@/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SLIDEIN_KF = [
  { transform: "translateY(-30%)", opacity: 0 },
  { transform: "translateY(0)", opacity: 1 },
];

const SLIDEOUT_KF = [
  { transform: "translateY(0)", opacity: 1 },
  { transform: "translateY(-30%)", opacity: 0 },
];

const ANIMATION_DURATION = 100;

export const Header = () => {
  const pathname = usePathname();
  const stickyHeaderRef = useRef<HTMLElement>(null);
  const { title, heroAreaRef } = useHeader();

  useEffect(() => {
    const hero = heroAreaRef.current;
    const stickyHeader = stickyHeaderRef.current;
    if (!hero || !stickyHeader) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio > 0) {
          if (!stickyHeader.classList.contains(styles.stickyHeaderVisible))
            return;
          const animation = stickyHeader.animate(SLIDEOUT_KF, {
            duration: ANIMATION_DURATION,
          });
          animation.onfinish = () => {
            stickyHeader.classList.remove(styles.stickyHeaderVisible);
          };
        } else {
          stickyHeader.classList.add(styles.stickyHeaderVisible);
          stickyHeader.animate(SLIDEIN_KF, { duration: ANIMATION_DURATION });
        }
      },
      { threshold: [0, 1] }
    );
    observer.observe(hero);
    return () => observer.unobserve(hero);
  }, [heroAreaRef, pathname]);

  return (
    <>
      <header className={styles.header}>
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <header className={styles.stickyHeader} ref={stickyHeaderRef}>
        <div className={styles.stickyHeaderBg} />
        <Link href="/">
          <Logo />
        </Link>
        <span className={styles.title}>{title}</span>
      </header>
    </>
  );
};

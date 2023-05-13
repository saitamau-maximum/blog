"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import { Logo } from "./logo";
import { useHeader } from "@/hooks";
import Link from "next/link";

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
  const topRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLElement>(null);
  const { title } = useHeader();

  useEffect(() => {
    const top = topRef.current;
    const hero = document.querySelector("#hero-area");
    const stickyHeader = stickyHeaderRef.current;
    if (!top || !hero || !stickyHeader) return;
    top.style.height = `${hero.clientHeight}px`;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
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
      { threshold: [1] }
    );
    observer.observe(top);
    return () => observer.unobserve(top);
  }, []);

  return (
    <>
      <div className={styles.top} ref={topRef}></div>
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

"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import { Logo } from "./logo";
import { useHeader } from "@/hooks";

const slideinKeyframes = [
  { transform: "translateY(-30%)", opacity: 0 },
  { transform: "translateY(0)", opacity: 1 },
];

const slideoutKeyframes = [
  { transform: "translateY(0)", opacity: 1 },
  { transform: "translateY(-30%)", opacity: 0 },
];

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
    if (!stickyHeader) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!stickyHeader.classList.contains(styles.stickyHeaderVisible))
            return;
          const animation = stickyHeader.animate(slideoutKeyframes, {
            duration: 100,
          });
          animation.onfinish = () => {
            stickyHeader.classList.remove(styles.stickyHeaderVisible);
          };
        } else {
          stickyHeader.classList.add(styles.stickyHeaderVisible);
          stickyHeader.animate(slideinKeyframes, { duration: 100 });
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
        <Logo />
      </header>
      <header className={styles.stickyHeader} ref={stickyHeaderRef}>
        <div className={styles.stickyHeaderBg} />
        <Logo />
        <span className={styles.title}>{title}</span>
      </header>
    </>
  );
};

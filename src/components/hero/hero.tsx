"use client";
import { ReactNode } from "react";
import styles from "./hero.module.css";
import { useHeader } from "@/hooks";

interface Props {
  title?: string;
  children: ReactNode;
}

export const Hero = ({ children, title }: Props) => {
  const { setTitle } = useHeader();
  title && setTitle(title);

  return (
    <div className={styles.hero} id="hero-area">
      <div className={styles.heroBg} />
      {children}
    </div>
  );
};

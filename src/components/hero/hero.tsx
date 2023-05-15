"use client";
import { ReactNode, useEffect } from "react";
import styles from "./hero.module.css";
import { useHeader } from "@/hooks";

interface Props {
  title?: string;
  children: ReactNode;
}

export const Hero = ({ children, title }: Props) => {
  const { setTitle, heroAreaRef } = useHeader();
  title && setTitle(title);

  useEffect(() => {
    return () => {
      setTitle("");
    };
  }, [setTitle]);

  return (
    <div className={styles.hero} ref={heroAreaRef}>
      <div className={styles.heroBg} />
      {children}
    </div>
  );
};

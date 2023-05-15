"use client";
import { ReactNode, useEffect } from "react";
import styles from "./hero.module.css";
import { useHeader } from "@/hooks";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { clsx } from "clsx";
import { FaSlash, FaSquareRootAlt } from "react-icons/fa";
import { MdHome } from "react-icons/md";

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
      setTitle("");
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
            <>
              {index !== breadcrumbs.length - 1 ? (
                <Link
                  href={breadcrumb.href}
                  key={`${breadcrumb.title}-${index}-breadcrumb`}
                  className={clsx(styles.breadcrumbItem, styles.link)}
                >
                  {breadcrumb.title}
                </Link>
              ) : (
                <span
                  key={`${breadcrumb.title}-${index}-breadcrumb`}
                  className={styles.breadcrumbItem}
                >
                  {breadcrumb.title}
                </span>
              )}
              {index !== breadcrumbs.length - 1 && (
                <IoIosArrowForward
                  className={styles.breadcrumbItem}
                  key={`${breadcrumb.title}-${index}-arrow`}
                />
              )}
            </>
          ))}
        </div>
        <span className={styles.information}>{information}</span>
      </div>
    </>
  );
};

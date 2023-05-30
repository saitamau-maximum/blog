"use client";
import NextImage from "next/image";
import { useEffect, useState } from "react";

import { useClickOutside } from "@/hooks";

import styles from "./image.module.css";

import type { ComponentProps } from "react";

type Props = ComponentProps<"img">;

export const Image = (props: Props) => {
  const { alt, src } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const ref = useClickOutside(() => {
    setIsExpanded(false);
  });

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isExpanded]);

  const img = (
    <span className={styles.imageContainer}>
      <NextImage
        alt={alt || ""}
        src={src || ""}
        fill
        className={styles.image}
        onClick={() => setIsExpanded(true)}
      />
    </span>
  );

  if (!isExpanded) {
    return img;
  }

  return (
    <>
      {img}
      <span className={styles.expanded}>
        <span ref={ref}>
          {/* eslint-disable @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.expandedImage} />
        </span>
      </span>
    </>
  );
};

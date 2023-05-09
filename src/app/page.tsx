import Image from "next/image";
import styles from "./page.module.css";
import { TEXT } from "@/constants/text";
import { Hero } from "./component/hero";

export default function Home() {
  return (
    <>
      <Hero>
        <div className={styles.heroContent}>
          <Image
            className={styles.heroIcon}
            src="/images/avatar.png"
            alt="Maximum's ICON"
            width={160}
            height={160}
          />
          <p className={styles.heroMessage}>{TEXT.TOP_WELCOME_MESSAGE}</p>
        </div>
      </Hero>
      <div className={styles.container}>
        <p className={styles.sectionTitle}>Coming Soon...</p>
      </div>
    </>
  );
}

import Image from "next/image";
import styles from "./page.module.css";
import { TEXT } from "@/constants/text";

export default function Home() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <Image
            className={styles.heroIcon}
            src="/images/avatar.png"
            alt="Maximum's ICON"
            width={200}
            height={200}
          />
          <div>
            <p className={styles.heroMessage}>{TEXT.TOP_WELCOME_MESSAGE}</p>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.main}>
          <p className={styles.sectionTitle}>Coming Soon...</p>
        </div>
      </div>
    </>
  );
}

import { ReactNode } from "react";
import styles from "./hero.module.css";

interface Props {
  children: ReactNode;
}

export const Hero = ({ children }: Props) => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBg} />
      {children}
    </div>
  );
};

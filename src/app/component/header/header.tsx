import styles from "./header.module.css";
import { Logo } from "./logo";
export const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
    </header>
  );
};

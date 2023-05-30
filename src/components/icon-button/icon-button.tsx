import { ComponentProps, ReactNode } from 'react';

import styles from './icon-button.module.css';

type Props = {
  children: ReactNode;
  onClick: () => void;
  ariaLabel: string;
} & ComponentProps<'button'>;

export const IconButton = ({ children, onClick, ariaLabel }: Props) => {
  return (
    <button
      className={styles.iconButton}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

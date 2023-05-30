'use client';
import { FaGithub } from 'react-icons/fa';

import { IconButton } from '@/components/icon-button';
import { ThemeSwitch } from '@/components/theme-switch';

import styles from './button-list.module.css';

interface Props {
  repositoryUrl: string;
}

export const BlogButtonList = ({ repositoryUrl }: Props) => {
  return (
    <div className={styles.buttonList}>
      <IconButton
        onClick={() => {
          window.open(repositoryUrl, '_blank');
        }}
        ariaLabel="記事のソースへ"
      >
        <FaGithub className={styles.githubIcon} />
      </IconButton>
      <ThemeSwitch />
    </div>
  );
};

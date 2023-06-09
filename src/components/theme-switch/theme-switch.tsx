import { FaMoon, FaSun } from 'react-icons/fa';

import { IconButton } from '../icon-button';

import styles from './theme-switch.module.css';

type Theme = 'light' | 'dark';

const judgeTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  if (localStorage.getItem('theme') === 'dark') {
    return 'dark';
  }
  return 'light';
};

export const ThemeSwitch = () => {
  const switchTheme = () => {
    const before = judgeTheme();
    const tweets = document.querySelectorAll('[data-tweet-id]');

    if (before === 'light') {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      tweets.forEach((tweet) => {
        const src = tweet.getAttribute('src');
        if (src) {
          tweet.setAttribute('src', src.replace('theme=light', 'theme=dark'));
        }
      });
    }
    if (before === 'dark') {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      tweets.forEach((tweet) => {
        const src = tweet.getAttribute('src');
        if (src) {
          tweet.setAttribute('src', src.replace('theme=dark', 'theme=light'));
        }
      });
    }
  };

  return (
    <IconButton onClick={switchTheme} ariaLabel="テーマを切り替える">
      <FaMoon className={styles.moon} />
      <FaSun className={styles.sun} />
    </IconButton>
  );
};

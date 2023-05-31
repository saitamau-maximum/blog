'use client';

import clipboardCopy from 'clipboard-copy';
import { clsx } from 'clsx';
import { FaRegCopy } from 'react-icons/fa';

import style from './div.module.css';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

const copyCode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  const pre =
    e.currentTarget.parentElement?.parentElement?.querySelector('pre');
  if (!pre) return;

  const code = pre.querySelector('code');
  if (!code) return;

  clipboardCopy(code.textContent || '');
};

export const Div = ({ children, className, ...rest }: Props) => {
  if (!className?.includes('remark-code-title')) {
    return <div {...rest}>{children}</div>;
  }

  return (
    <div className={clsx(style.remarkCodeTitle, className)} {...rest}>
      {children}
      <button onClick={copyCode} aria-label="Copy" className={style.copy}>
        <FaRegCopy className={style.copyIcon} />
      </button>
    </div>
  );
};

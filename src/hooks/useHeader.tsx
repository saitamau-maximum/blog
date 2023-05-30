'use client';
import { ReactNode, useRef } from 'react';
import { useState } from 'react';

import { createCtx } from '@/util/context';

type IHeaderContext = {
  title?: string;
  setTitle: (title: string) => void;
  heroAreaRef: React.RefObject<HTMLDivElement>;
};

const [useHeader, SetHeaderProvider] = createCtx<IHeaderContext>();

export { useHeader };

const useHeaderCtx = (): IHeaderContext => {
  const [title, setTitle] = useState<string | undefined>(undefined);
  const heroAreaRef = useRef<HTMLDivElement>(null);

  return {
    setTitle,
    title,
    heroAreaRef,
  };
};

interface Props {
  children: ReactNode;
}

export const HeaderProvider = ({ children }: Props) => {
  const header = useHeaderCtx();
  return <SetHeaderProvider value={header}>{children}</SetHeaderProvider>;
};

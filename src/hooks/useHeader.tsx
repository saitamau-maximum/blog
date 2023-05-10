"use client";
import type { ReactNode } from "react";
import { useState } from "react";

import { createCtx } from "@/util/context";

type IHeaderContext = {
  title?: string;
  setTitle: (title: string) => void;
};

const [useHeader, SetHeaderProvider] = createCtx<IHeaderContext>();

export { useHeader };

const useHeaderCtx = (): IHeaderContext => {
  const [title, setTitle] = useState<string | undefined>(undefined);

  return {
    setTitle,
    title,
  };
};

interface Props {
  children: ReactNode;
}

export const HeaderProvider = ({ children }: Props) => {
  const header = useHeaderCtx();
  return <SetHeaderProvider value={header}>{children}</SetHeaderProvider>;
};

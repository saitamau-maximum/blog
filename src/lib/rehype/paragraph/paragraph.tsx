import { ReactElement } from 'react';

import { LinkCard } from '@/components/blog/link-card';

interface Props {
  children: ReactElement[];
}

export const Paragraph = ({ children }: Props) => {
  if (children?.length === 1 && children[0].type === 'a') {
    // もしpタグchildの要素がaタグで、かつ子要素が1つだけの場合
    // (リスト内のリンクの場合は除外)
    return <LinkCard href={children[0].props.href} />;
  }

  return <p>{children}</p>;
};

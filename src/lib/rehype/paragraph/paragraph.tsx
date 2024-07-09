import { ReactElement } from 'react';

import { LinkCard } from '@/components/blog/link-card';

interface Props {
  children: ReactElement | ReactElement[];
}

export const Paragraph = ({ children }: Props) => {
  if (
    typeof children === 'object' &&
    !Array.isArray(children) &&
    children.type === 'a'
  ) {
    // もしpタグchildの要素がaタグで、かつ子要素が1つだけの場合
    // (リスト内のリンクの場合は除外)
    return <LinkCard href={children.props.href} />;
  }

  return <p>{children}</p>;
};

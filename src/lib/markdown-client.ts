import { createElement, Fragment } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

import { Anchor } from './rehype/anchor';
import { Div } from './rehype/div';
import { Image } from './rehype/image';

export const parseHTMLToReactJSX = (htmlContent: string) => {
  const processor = unified()
    .use(rehypeParse, {
      fragment: true,
    }) //                    [html -> hast] HTMLをhast(HTML抽象構文木)に変換
    // @ts-ignore
    .use(rehypeReact, {
      components: {
        a: Anchor,
        img: Image,
        div: Div,
      },
      createElement,
      Fragment,
    }); //                   [hast -> jsx] hast(HTML抽象構文木)を一部ReactJSXに変換
  return processor.processSync(htmlContent).result;
};

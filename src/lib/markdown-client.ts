import { createElement, Fragment } from 'react';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { jsx, jsxs } from 'react/jsx-runtime';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

import { Div } from './rehype/div';
import { Image } from './rehype/image';
import { Paragraph } from './rehype/paragraph';

export const parseHTMLToReactJSX = (htmlContent: string) => {
  const processor = unified()
    .use(rehypeParse, {
      fragment: true,
    }) //                    [html -> hast] HTMLをhast(HTML抽象構文木)に変換
    // @ts-ignore
    .use(rehypeReact, {
      jsx,
      jsxs,
      jsxDEV,
      components: {
        img: Image,
        div: Div,
        p: Paragraph,
      },
      createElement,
      Fragment,
    }); //                   [hast -> jsx] hast(HTML抽象構文木)を一部ReactJSXに変換
  return processor.processSync(htmlContent).result;
};

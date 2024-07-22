// @ts-nocheck
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const remarkCustomDirectives: Plugin<[]> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'details') {
        const [summary, ...children] = node.children;
        node.type = 'details';
        node.data = {
          hName: 'details',
        };
        node.children = [
          {
            type: 'summary',
            data: {
              hName: 'summary',
            },
            children: [
              {
                type: 'text',
                value: summary.children[0].value,
              },
            ],
          },
          {
            type: 'div',
            data: {
              hName: 'div',
              hProperties: {
                className: 'body',
              },
            },
            children,
          },
        ];
      }
    });
  };
};

export default remarkCustomDirectives;

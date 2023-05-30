declare module 'remark-extract-toc' {
  /**
   * Type definition for the `extractToc` function.
   * @param {Object} opt - Options object.
   * @param {boolean} [opt.flatten=false] - Whether to flatten the TOC into a list of objects.
   * @param {string[]} [opt.keys=[]] - Optional keys to include in each TOC object.
   * @returns {function} A transformer function that extracts a table of contents from a given AST.
   */
  function extractToc(opt?: {
    flatten?: boolean;
    keys?: string[];
  }): (ast: any, file: any) => any;
  export = extractToc;
}

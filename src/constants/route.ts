export const ROUTE = {
  /** トップページ */
  TOP: '/',
  /** ブログ一覧 */
  BLOG_LIST: '/blog',
  /**
   * ブログ詳細
   * @example
   * const path = BLOG_DETAIL(["2023", "webken", "1"])
   * console.log(path) // "/blog/2023/webken/1"
   */
  BLOG_DETAIL: (slug: string[]) => `/blog/${slug.join('/')}`,
  /** タグ一覧 */
  TAGGED_BLOG_LIST: (tag: string) => `/blog/tag/${tag}`,
  /** ブログリレー一覧 */
  RELAY_LIST: '/relay',
  /** ブログリレー詳細 */
  RELAY_DETAIL: (slug: string) => `/relay/${slug}`,
} as const;

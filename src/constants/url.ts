import path from 'path';

export const URL = {
  BLOG_DIR_PATH: path.join(process.cwd(), 'blog'),
  RELAY_DIR_PATH: path.join(process.cwd(), 'relay'),
  BLOG_FILE_PATH: (slug: string[]) =>
    path.join(URL.BLOG_DIR_PATH, ...slug) + '.md',
  RELAY_FILE_PATH: (filename: string) =>
    path.join(URL.RELAY_DIR_PATH, filename),
  GITHUB_REPOSITORY_BLOG_URL: (slug: string[]) =>
    `https://github.com/saitamau-maximum/blog/blob/main/blog/${slug.join(
      '/',
    )}.md`,
  GITHUB_PROFILE_URL: (username: string) => `https://github.com/${username}`,
  GITHUB_PROFILE_IMAGE_URL: (username: string) =>
    `https://github.com/${username}.png`,
  ORIGIN:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://blog.maximum.vc',
};

export const OGP = {
  PUBLIC_DIR_PATH: path.join(process.cwd(), 'public'),
  BLOG_CACHE_DIR_PATH: path.join(process.cwd(), '.cache/blog'),
  OGP_BASE_IMAGE_PATH: '/images/ogp/base.png',
  OGP_DEFAULT_IMAGE_PATH: '/images/ogp/default.png',
  OGP_GENERATED_IMAGE_PATH: '/images/ogp/generated',
  OGP_DYNAMIC_IMAGE: (slug: string[]) =>
    `${OGP.OGP_GENERATED_IMAGE_PATH}/${slug.join('-')}.png`,
};

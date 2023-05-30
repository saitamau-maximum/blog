import path from 'path';

export const URL = {
<<<<<<< HEAD
  BLOG_DIR_PATH: path.join(process.cwd(), "blog"),
  PUBLIC_DIR_PATH: path.join(process.cwd(), "public"),
  BLOG_CACHE_DIR_PATH: path.join(process.cwd(), ".cache/blog"),
=======
  BLOG_DIR_PATH: path.join(process.cwd(), 'blog'),
  RELAY_DIR_PATH: path.join(process.cwd(), 'relay'),
>>>>>>> 9776a8640ee6a1854f1bec36774c356c8a011c61
  BLOG_FILE_PATH: (filename: string) => path.join(URL.BLOG_DIR_PATH, filename),
  RELAY_FILE_PATH: (filename: string) =>
    path.join(URL.RELAY_DIR_PATH, filename),
  GITHUB_REPOSITORY_BLOG_URL: (slug: string) =>
    `https://github.com/saitamau-maximum/blog/blob/main/blog/${slug}.md`,
  GITHUB_PROFILE_URL: (username: string) => `https://github.com/${username}`,
  GITHUB_PROFILE_IMAGE_URL: (username: string) =>
    `https://github.com/${username}.png`,
};

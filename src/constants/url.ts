import path from "path";

export const URL = {
  BLOG_DIR_PATH: path.join(process.cwd(), "blog"),
  BLOG_FILE_PATH: (filename: string) => path.join(URL.BLOG_DIR_PATH, filename),
  GITHUB_REPOSITORY_BLOG_URL: (slug: string) =>
    `https://github.com/saitamau-maximum/blog/blob/main/blog/${slug}.md`,
  GITHUB_PROFILE_URL: (username: string) => `https://github.com/${username}`,
  GITHUB_PROFILE_IMAGE_URL: (username: string) =>
    `https://github.com/${username}.png`,
};

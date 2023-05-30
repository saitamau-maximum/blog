import path from "path";

export const URL = {
  BLOG_DIR_PATH: path.join(process.cwd(), "blog"),
  RELAY_DIR_PATH: path.join(process.cwd(), "relay"),
  BLOG_FILE_PATH: (slug: string[]) =>
    path.join(URL.BLOG_DIR_PATH, ...slug) + ".md",
  RELAY_FILE_PATH: (filename: string) =>
    path.join(URL.RELAY_DIR_PATH, filename),
  GITHUB_REPOSITORY_BLOG_URL: (slug: string[]) =>
    `https://github.com/saitamau-maximum/blog/blob/main/blog/${slug.join(
      "/"
    )}.md`,
  GITHUB_PROFILE_URL: (username: string) => `https://github.com/${username}`,
  GITHUB_PROFILE_IMAGE_URL: (username: string) =>
    `https://github.com/${username}.png`,
};

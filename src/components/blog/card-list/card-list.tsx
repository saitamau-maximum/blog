import { BlogCard } from "../card";

import styles from "./card-list.module.css";

interface Props {
  blogs: {
    title: string;
    slug: string;
    date: string;
    authors: string[];
    tags: string[];
  }[];
}

export const BlogCardList = ({ blogs }: Props) => {
  if (blogs.length === 0) {
    return (
      <div className={styles.cardListEmpty}>
        <p className={styles.cardListEmptyMessage}>記事がありません。</p>
      </div>
    );
  }

  return (
    <div className={styles.cardList}>
      {blogs.map((blog) => (
        <BlogCard
          key={blog.slug}
          title={blog.title}
          slug={blog.slug}
          date={blog.date}
          authors={blog.authors}
          tags={blog.tags}
        />
      ))}
    </div>
  );
};

import { parseHTMLToReactJSX } from "@/lib/markdown";

import styles from "./article.module.css";
import "./prism.css";
import "katex/dist/katex.min.css";

interface Props {
  content: string;
}

export const Article = ({ content }: Props) => {
  return (
    <article className={styles.content}>{parseHTMLToReactJSX(content)}</article>
  );
};

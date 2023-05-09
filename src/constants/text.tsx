import { Fragment } from "react";

export const TEXT = {
  /** サイトのタイトル */
  SITE_TITLE: "Maximum Blog",
  /** サイトのデフォルトの説明文 */
  SITE_DESCRIPTION:
    "埼玉大学プログラミングサークル Maximum のブログです。活動内での発見や学びを発信しています。",
  /** サイト内のトップページの上にあるメッセージの文言 */
  TOP_WELCOME_MESSAGE: `
埼玉大学プログラミングサークル「Maximum」の技術ブログです。
アドベントカレンダーなどのイベントの記事や、メンバーの技術記事を投稿しています。
また、サークル内で扱った講義の資料も公開していますので、ぜひご覧ください。
`.trim(),
} as const;

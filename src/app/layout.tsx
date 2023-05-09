import { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: {
    default: "Maximum Blog",
    template: "%s | Maximum Blog",
  },
  description:
    "埼玉大学プログラミングサークル Maximum のブログです。活動内での発見や学びを発信しています。",
} satisfies Metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/fouc.js" />
      </head>
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}

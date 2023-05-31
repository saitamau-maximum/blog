import { Metadata } from 'next';
import './globals.css';
import { Noto_Sans_JP } from 'next/font/google';

import { TEXT } from '@/constants/text';
import { OGP } from '@/constants/url';
import { HeaderProvider } from '@/hooks';

import { Header } from '../components/header';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  metadataBase: new URL(process.env.URL ?? 'http://localhost:3000'),
  title: {
    default: TEXT.SITE_TITLE,
    template: `%s | ${TEXT.SITE_TITLE}`,
  },
  description: TEXT.SITE_DESCRIPTION,
  openGraph: {
    title: {
      default: TEXT.SITE_TITLE,
      template: `%s | ${TEXT.SITE_TITLE}`,
    },
    description: TEXT.SITE_DESCRIPTION,
    images: [
      {
        url: OGP.OGP_DEFAULT_IMAGE_PATH,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: TEXT.SITE_TITLE,
      template: `%s | ${TEXT.SITE_TITLE}`,
    },
    description: TEXT.SITE_DESCRIPTION,
  },
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
      <body className={notoSansJP.className}>
        <HeaderProvider>
          <Header />
          <main>{children}</main>
        </HeaderProvider>
      </body>
    </html>
  );
}

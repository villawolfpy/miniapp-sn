import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SN Reader — Mini App',
  description: 'Read Stacker News without leaving Farcaster.',
  openGraph: {
    title: 'SN Reader — Mini App',
    description: 'Read Stacker News without leaving Farcaster.',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'SN Reader',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SN Reader — Mini App',
    description: 'Read Stacker News without leaving Farcaster.',
    images: ['/og.svg'],
  },
  other: {
    'fc:miniapp': 'https://yourdomain.com',
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://yourdomain.com/og.svg',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Open Mini App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://yourdomain.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

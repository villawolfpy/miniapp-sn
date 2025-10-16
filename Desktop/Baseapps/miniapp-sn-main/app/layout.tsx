import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stacker.News Mini App',
  description: 'Read Stacker News without leaving Farcaster.',
  openGraph: {
    title: 'Stacker.News Mini App',
    description: 'Read Stacker News without leaving Farcaster.',
    images: [
      {
        url: 'https://sn-app-eta.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stacker.News Mini App',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stacker.News Mini App',
    description: 'Read Stacker News without leaving Farcaster.',
    images: ['https://sn-app-eta.vercel.app/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://sn-app-eta.vercel.app/og-image.png',
    'fc:frame:post_url': 'https://sn-app-eta.vercel.app/api/frame',
    'fc:frame:button:1': '📊 Trending Posts',
    'fc:frame:button:2': '🆕 Latest Posts',
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
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={8453} // Base
          miniKit={{ enabled: true }}
        >
          {children}
        </OnchainKitProvider>
      </body>
    </html>
  );
}

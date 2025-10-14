import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SN Reader — Mini App',
  description: 'Read Stacker News without leaving Farcaster.',
  openGraph: {
    title: 'SN Reader — Mini App',
    description: 'Read Stacker News without leaving Farcaster.',
    images: [
      {
        url: '/og.png',
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
    images: ['/og.png'],
  },
  other: {
    'fc:miniapp': 'https://sn-app-eta.vercel.app',
    'fc:frame': 'vNext',
    'og:image': 'https://sn-app-eta.vercel.app/og.png',
    'fc:frame:image': 'https://sn-app-eta.vercel.app/og.png',
    'fc:frame:button:1': 'Open Mini App',
    'fc:frame:button:1:target': 'https://sn-app-eta.vercel.app',
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

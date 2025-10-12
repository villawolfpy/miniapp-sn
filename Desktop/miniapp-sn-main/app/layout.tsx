import './globals.css';
import type { Metadata } from 'next';

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
    'fc:miniapp': 'https://sn-reader-farcaster.bolt.host',
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://sn-reader-farcaster.bolt.host/og.png',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Open Mini App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://sn-reader-farcaster.bolt.host',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

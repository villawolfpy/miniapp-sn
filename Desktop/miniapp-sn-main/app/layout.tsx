import './globals.css';
import type { Metadata } from 'next';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://pink-books-grow.loca.lt';

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: 'SN Reader — Mini App',
  description: 'Lee Stacker News sin salir del cliente Farcaster.',
  openGraph: {
    title: 'SN Reader — Mini App',
    description: 'Lee Stacker News sin salir del cliente Farcaster.',
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SN Reader — Mini App',
    description: 'Lee Stacker News sin salir del cliente Farcaster.',
    images: ['/og.png'],
  },
  other: {
    'fc:miniapp': 'v1',
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://pink-books-grow.loca.lt/og.png',
    'fc:frame:button:1': 'Abrir Mini App',
    'fc:frame:button:1:target': 'https://pink-books-grow.loca.lt',
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

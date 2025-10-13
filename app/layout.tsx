import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Stacker News Frames",
  description:
    "Frame v2 para explorar los posts recientes de los territorios de Stacker News usando su RSS oficial.",
  openGraph: {
    title: "Stacker News Frames",
    description:
      "Explora posts recientes de Stacker News dentro de Farcaster Frames con navegación y selección de territorios.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Stacker News Frames",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stacker News Frames",
    description: "Explora los territorios de Stacker News sin salir de Farcaster.",
    images: ["/og.png"],
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}

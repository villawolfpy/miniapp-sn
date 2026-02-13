import type { Metadata } from 'next';
import './globals.css';
import { MiniAppReady } from '@/components/MiniAppReady';
import { buildMiniappMetadata } from '@/lib/miniapp';

const miniappMeta = buildMiniappMetadata('/');

export const metadata: Metadata = {
  title: 'StarScout - Your AI Ad Companion',
  description: 'Ads powered by StarScout on Base.',
  metadataBase: miniappMeta.metadataBase,
  openGraph: miniappMeta.openGraph,
  other: miniappMeta.other as Record<string, string>,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniAppReady />
        {children}
      </body>
    </html>
  );
}

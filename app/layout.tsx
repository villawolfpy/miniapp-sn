import type { Metadata } from 'next';
import './globals.css';
import { MiniAppReady } from '@/components/MiniAppReady';

export const metadata: Metadata = {
  title: 'Cubey - Your AI Ad Companion',
  description: 'Ads powered by Cubey on Base.',
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

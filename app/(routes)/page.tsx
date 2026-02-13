import { Suspense } from 'react';
import { HomeClient } from './HomeClient';
import { buildMiniappMetadata } from '@/lib/miniapp';

export const metadata = buildMiniappMetadata('/');

export default function HomePage() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}

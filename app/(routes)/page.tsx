import { HomeClient } from './HomeClient';
import { buildMiniappMetadata } from '@/lib/miniapp';

export const metadata = buildMiniappMetadata('/');

export default function HomePage() {
  return <HomeClient />;
}

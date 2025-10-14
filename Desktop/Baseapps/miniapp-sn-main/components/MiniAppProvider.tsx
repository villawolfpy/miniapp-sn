'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@/lib/miniapp';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // MiniKit handles compatibility checks internally
  return <>{children}</>;
}

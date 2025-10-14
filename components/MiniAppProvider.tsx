'use client';

import { useEffect } from 'react';
import { useMiniApp } from '@/lib/miniapp';

interface MiniAppProviderProps {
  children: React.ReactNode;
}

export function MiniAppProvider({ children }: MiniAppProviderProps) {
  const { ready, isReady, environment } = useMiniApp();

  useEffect(() => {
    if (!isReady && environment !== 'browser') {
      void ready();
    }
  }, [environment, isReady, ready]);

  return <>{children}</>;
}

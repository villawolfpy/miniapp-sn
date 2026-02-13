'use client';

import { useEffect } from 'react';

export function MiniAppReady() {
  useEffect(() => {
    try {
      const readyFn = window.farcaster?.sdk?.actions?.ready;
      if (typeof readyFn === 'function') {
        readyFn();
      }
    } catch {
      // no-op: SDK not available outside Farcaster client
    }
  }, []);

  return null;
}

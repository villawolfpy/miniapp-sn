'use client';

import { useEffect } from 'react';
import { useMiniApp } from '@/lib/miniapp';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const { ready, isSupported } = useMiniApp();

  useEffect(() => {
    ready();
  }, [ready]);

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Mini Apps not supported
          </h2>
          <p className="text-gray-600 mb-4">
            Please open this in a Farcaster client that supports Mini Apps.
          </p>
          <a
            href="https://stacker.news"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open in Browser
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

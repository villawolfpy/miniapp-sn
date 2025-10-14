'use client';

import { useEffect, useState } from 'react';
import { PostItem } from '@/lib/rss';
import { getBrowserLocale, type Locale, useI18n } from '@/lib/i18n';
import { useMiniApp } from '@/lib/miniapp';
import { TerritorySelector } from '@/components/TerritorySelector';
import { PostList } from '@/components/PostList';
import { MiniAppProvider } from '@/components/MiniAppProvider';
import { truncateAddress, truncateHex } from '@/lib/utils';

type NoticeState = { type: 'success' | 'error'; message: string } | null;

function HomePage() {
  const [territory, setTerritory] = useState('bitcoin');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [notice, setNotice] = useState<NoticeState>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const { connectWallet, context, lastError, clearError } = useMiniApp();
  const t = useI18n(locale);

  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/rss?territory=${territory}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [territory]);

  useEffect(() => {
    if (lastError) {
      setNotice({ type: 'error', message: lastError });
    }
  }, [lastError]);

  const handleConnect = async () => {
    setAuthLoading(true);
    setNotice(null);

    try {
      await connectWallet();
      setNotice({ type: 'success', message: t.sessionVerified });
    } catch (error) {
      const message = error instanceof Error ? error.message : t.sessionFailed;
      setNotice({ type: 'error', message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDismissNotice = () => {
    setNotice(null);
    clearError();
  };

  const walletAddress = context?.address ?? null;
  const sessionSignature = context?.sessionSignature ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{t.appName}</h1>
            {walletAddress && (
              <p className="text-xs text-gray-500 mt-1">
                {t.connectedAs}{' '}
                <span className="font-mono text-gray-700">{truncateAddress(walletAddress)}</span>
              </p>
            )}
          </div>
          {!walletAddress ? (
            <button
              onClick={handleConnect}
              disabled={authLoading}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {authLoading ? t.connecting : t.connectWallet}
            </button>
          ) : (
            sessionSignature && (
              <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                {t.sessionSignature}: {truncateHex(sessionSignature)}
              </span>
            )
          )}
        </div>
        {notice && (
          <div
            className={`border-t px-4 py-3 text-xs ${
              notice.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="max-w-md mx-auto flex items-start justify-between gap-4">
              <p className="leading-snug">{notice.message}</p>
              <button
                onClick={handleDismissNotice}
                className="text-[11px] font-medium uppercase tracking-wide"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {context?.sessionMessage && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <p className="font-semibold">{t.sessionMessageLabel}</p>
            <p className="mt-1 break-words font-mono text-[11px] text-blue-900">
              {context.sessionMessage}
            </p>
            {context.chainId && (
              <p className="mt-2 text-[11px] text-blue-600">Chain ID: {context.chainId}</p>
            )}
          </div>
        )}

        <TerritorySelector selected={territory} onChange={setTerritory} locale={locale} />

        {loading && (
          <div className="text-center py-12 text-gray-500">{t.loading}</div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{t.error}</p>
            <button
              onClick={() => setTerritory(territory)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.retry}
            </button>
          </div>
        )}

        {!loading && !error && <PostList posts={posts} locale={locale} />}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <MiniAppProvider>
      <HomePage />
    </MiniAppProvider>
  );
}

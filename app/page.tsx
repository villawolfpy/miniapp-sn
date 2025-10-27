'use client';

import { useEffect, useMemo, useState } from 'react';
import { TerritorySelector } from '@/components/TerritorySelector';
import { PostList } from '@/components/PostList';
import { MiniAppProvider } from '@/components/MiniAppProvider';
import { getBrowserLocale, Locale } from '@/lib/i18n';
import { useMiniApp } from '@/lib/miniapp';
import { useTerritories } from '@/lib/hooks/useTerritories';
import { usePosts } from '@/lib/hooks/usePosts';

function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const { territories, loading: territoriesLoading, error: territoriesError, reload } =
    useTerritories();
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>('bitcoin');
  const { posts, loading, loadingMore, error, hasMore, loadMore, refresh } = usePosts(
    selectedTerritory
  );
  const { signin, context, isSupported } = useMiniApp();

  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  useEffect(() => {
    if (!selectedTerritory && territories.length) {
      setSelectedTerritory(territories[0].slug);
    }
  }, [territories, selectedTerritory]);

  const loadingText = locale === 'es' ? 'Cargando...' : 'Loading...';
  const errorText = locale === 'es' ? 'Error al cargar posts' : 'Error loading posts';
  const retryText = locale === 'es' ? 'Reintentar' : 'Retry';
  const loadMoreText = locale === 'es' ? 'Cargar más' : 'Load more';
  const refreshText = locale === 'es' ? 'Actualizar' : 'Refresh';

  const territoryList = useMemo(() => territories, [territories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">SN Reader</h1>
          {isSupported && !context?.user && (
            <button
              onClick={signin}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {locale === 'es' ? 'Iniciar Sesión' : 'Sign In'}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        <TerritorySelector
          territories={territoryList}
          selected={selectedTerritory}
          onChange={(slug) => {
            setSelectedTerritory(slug);
          }}
          locale={locale}
          loading={territoriesLoading}
          error={territoriesError}
          onRetry={reload}
        />

        {selectedTerritory && (
          <div className="flex justify-end">
            <button
              onClick={() => void refresh()}
              className="text-xs text-blue-600 hover:text-blue-700"
              disabled={loading}
            >
              {refreshText}
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500">{loadingText}</div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">{errorText}</p>
            <p className="text-xs text-gray-500 mb-4 break-words">{error}</p>
            <button
              onClick={() => void refresh()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {retryText}
            </button>
          </div>
        )}

        {!loading && !error && (
          <PostList posts={posts} territory={selectedTerritory} locale={locale} />
        )}

        {hasMore && !loading && (
          <div className="flex justify-center">
            <button
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loadingMore ? loadingText : loadMoreText}
            </button>
          </div>
        )}
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

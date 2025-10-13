'use client';

import { useState, useEffect } from 'react';
import { PostItem } from '@/lib/rss';
import { getBrowserLocale, Locale } from '@/lib/i18n';
import { useMiniApp } from '@/lib/miniapp';
import { TerritorySelector } from '@/components/TerritorySelector';
import { PostList } from '@/components/PostList';
import { MiniAppProvider } from '@/components/MiniAppProvider';

function HomePage() {
  const [territory, setTerritory] = useState('bitcoin');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const { signin, context } = useMiniApp();

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

  const loadingText = locale === 'es' ? 'Cargando...' : 'Loading...';
  const errorText = locale === 'es' ? 'Error al cargar posts' : 'Error loading posts';
  const retryText = locale === 'es' ? 'Reintentar' : 'Retry';
  const signinText = locale === 'es' ? 'Iniciar Sesión' : 'Sign In';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">SN Reader</h1>
          {!context?.user && (
            <button
              onClick={signin}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {signinText}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <TerritorySelector
          selected={territory}
          onChange={setTerritory}
          locale={locale}
        />

        {loading && (
          <div className="text-center py-12 text-gray-500">{loadingText}</div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{errorText}</p>
            <button
              onClick={() => setTerritory(territory)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {retryText}
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

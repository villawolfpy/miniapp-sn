'use client';

import { useState, useEffect } from 'react';
import { getBrowserLocale, Locale } from '@/lib/i18n';
import { useMiniKit } from '@/lib/miniapp';
import { TerritorySelector } from '@/components/TerritorySelector';
import { PostList } from '@/components/PostList';
import { MiniAppProvider } from '@/components/MiniAppProvider';

interface Post {
  id: number;
  title: string;
  url?: string;
  user?: string;
  upvotes: number;
  comments: number;
  createdAt: string;
}

interface PostItem {
  id: string;
  title: string;
  url: string;
  points: number;
  by: string;
  timeAgo: string;
  description?: string;
}

function HomePage() {
  const [territory, setTerritory] = useState('bitcoin');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [type, setType] = useState<'trending' | 'latest'>('trending');
  const { context } = useMiniKit();

  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/posts?type=${type}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [type]);

  const loadingText = locale === 'es' ? 'Cargando...' : 'Loading...';
  const errorText = locale === 'es' ? 'Error al cargar posts' : 'Error loading posts';
  const retryText = locale === 'es' ? 'Reintentar' : 'Retry';
  const signinText = locale === 'es' ? 'Iniciar Sesión' : 'Sign In';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">📰 Stacker.News Posts</h1>
          {!context?.user && (
            <button
              onClick={() => {}}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {signinText}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('trending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              type === 'trending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Trending
          </button>
          <button
            onClick={() => setType('latest')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              type === 'latest'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🆕 Latest
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">{loadingText}</div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{errorText}</p>
            <button
              onClick={() => setType(type)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {retryText}
            </button>
          </div>
        )}

        {!loading && !error && <PostList posts={posts.map(post => ({
          id: post.id.toString(),
          title: post.title,
          url: post.url || `https://stacker.news/items/${post.id}`,
          points: post.upvotes,
          by: post.user || 'anonymous',
          timeAgo: new Date(post.createdAt).toLocaleDateString(),
          description: post.title
        }))} locale={locale} />}
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

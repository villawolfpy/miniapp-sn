'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import { MiniAppProvider } from '@/components/MiniAppProvider';
import { getBrowserLocale, Locale } from '@/lib/i18n';
import { useMiniApp } from '@/lib/miniapp';
import type { PostSummary, PostsApiResponse } from '@/lib/sn/types';
import { formatRelativeTime } from '@/lib/utils';
import { getCachedPosts } from '@/lib/hooks/post-cache';

function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState<PostSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const { composeCast, openUrl, isSupported } = useMiniApp();

  const territorySlug = useMemo(() => searchParams?.get('territory') ?? null, [searchParams]);

  const postId = useMemo(() => {
    const paramId = params?.id;
    if (typeof paramId === 'string') return paramId;
    if (Array.isArray(paramId)) return paramId[0] ?? '';
    return '';
  }, [params]);

  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  useEffect(() => {
    if (!postId) {
      return;
    }

    const cached = getCachedPosts(territorySlug);
    const cachedPost = cached?.posts.find((item) => item.id === postId);
    if (cachedPost) {
      setPost(cachedPost);
    }

    const controller = new AbortController();

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/sn/posts?id=${encodeURIComponent(postId)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to load post (${response.status})`);
        }
        const data = (await response.json()) as PostsApiResponse;
        const fetchedPost = data.posts?.[0] ?? null;
        setPost(fetchedPost);
        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Unknown error');
        if (!cachedPost) {
          setPost(null);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchPost();

    return () => controller.abort();
  }, [postId, territorySlug]);

  const handleShare = async () => {
    if (!post) return;
    const targetUrl = post.url || `https://stacker.news${post.path}`;
    const text = `${post.title}\n\n${targetUrl}`;

    try {
      if (isSupported) {
        await composeCast(text);
        setShareMessage(locale === 'es' ? 'Compartido en Farcaster' : 'Shared to Farcaster');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: post.title, text, url: targetUrl });
        setShareMessage(locale === 'es' ? 'Compartido' : 'Shared');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareMessage(locale === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard');
        return;
      }
    } catch (err) {
      console.warn('Share failed', err);
    }

    setShareMessage(locale === 'es' ? 'No se pudo compartir' : 'Unable to share');
  };

  const handleOpenInSN = () => {
    if (!post) return;
    const targetUrl = post.url || `https://stacker.news${post.path}`;
    openUrl(targetUrl);
  };

  const timeAgo = post ? formatRelativeTime(post.createdAt) : '';

  const loadingText = locale === 'es' ? 'Cargando...' : 'Loading...';
  const shareText = locale === 'es' ? 'Compartir' : 'Share';
  const openInSNText = locale === 'es' ? 'Abrir en Stacker News' : 'Open in Stacker News';
  const pointsText = locale === 'es' ? 'puntos' : 'points';
  const byText = locale === 'es' ? 'por' : 'by';
  const backText = locale === 'es' ? 'Volver' : 'Back';

  if (loading && !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">{loadingText}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">{error ?? 'Post not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {backText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Post Detail</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {shareMessage && (
          <div className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            {shareMessage}
          </div>
        )}

        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="font-medium text-blue-600">
                  {post.sats} {pointsText}
                </span>
                <span>
                  {byText} {post.author}
                </span>
                {timeAgo && <span className="text-gray-400">{timeAgo}</span>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {shareText}
              </button>

              <button
                onClick={handleOpenInSN}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {openInSNText}
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default function PostDetail() {
  return (
    <MiniAppProvider>
      <PostDetailPage />
    </MiniAppProvider>
  );
}

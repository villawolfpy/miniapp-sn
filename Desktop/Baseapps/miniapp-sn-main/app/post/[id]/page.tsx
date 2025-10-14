'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostItem } from '@/lib/rss';
import { getBrowserLocale, Locale } from '@/lib/i18n';
import { useMiniKit } from '@/lib/miniapp';
import { MiniAppProvider } from '@/components/MiniAppProvider';
import { ArrowLeft, ExternalLink, Share2 } from 'lucide-react';

function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('en');
  const { composeCast, openUrl } = useMiniKit();
  // Note: composeCast and openUrl may need to be updated based on MiniKit API

  useEffect(() => {
    setLocale(getBrowserLocale());
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rss?territory=recent');
        const data = await response.json();
        const foundPost = data.items.find((p: PostItem) => p.id === params.id);
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleShare = () => {
    if (post) {
      const text = `${post.title}\n\n${post.url}`;
      composeCast(text);
    }
  };

  const handleOpenInSN = () => {
    if (post) {
      openUrl(post.url);
    }
  };

  const loadingText = locale === 'es' ? 'Cargando...' : 'Loading...';
  const shareText = locale === 'es' ? 'Compartir' : 'Share';
  const openInSNText = locale === 'es' ? 'Abrir en Stacker News' : 'Open in Stacker News';
  const pointsText = locale === 'es' ? 'puntos' : 'points';
  const byText = locale === 'es' ? 'por' : 'by';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">{loadingText}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Post not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
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

      <main className="max-w-md mx-auto px-4 py-6">
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h2>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <span className="font-medium text-blue-600">
                {post.points} {pointsText}
              </span>
              <span>
                {byText} {post.by}
              </span>
              <span className="text-gray-400">{post.timeAgo}</span>
            </div>

            {post.description && (
              <p className="text-gray-700 leading-relaxed mb-6">{post.description}</p>
            )}

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

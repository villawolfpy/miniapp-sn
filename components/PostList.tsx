'use client';

import Link from 'next/link';
import type { SnPost } from '@/lib/sn';

interface PostListProps {
  posts: SnPost[];
  locale: 'en' | 'es';
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

/**
 * Renders a paginated list of posts with territory and author metadata.
 */
export function PostList({ posts, locale, onLoadMore, isLoadingMore = false }: PostListProps) {
  const pointsText = locale === 'es' ? 'puntos' : 'points';
  const byText = locale === 'es' ? 'por' : 'by';
  const loadMoreText = locale === 'es' ? 'Cargar más' : 'Load more';

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {locale === 'es' ? 'No se encontraron posts' : 'No posts found'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <Link href={`/post/${post.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
                {post.territoryName ?? post.territoryId}
              </span>
              <time className="text-[11px] text-gray-400" dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleString(locale)}
              </time>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{post.title}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {typeof post.score === 'number' && (
                <span className="font-medium text-blue-600">
                  {post.score} {pointsText}
                </span>
              )}
              {post.author?.username && (
                <span>
                  {byText} {post.author.displayName ?? post.author.username}
                </span>
              )}
            </div>
          </Link>
        </article>
      ))}

      {onLoadMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-60"
        >
          {isLoadingMore ? `${loadMoreText}…` : loadMoreText}
        </button>
      )}
    </div>
  );
}

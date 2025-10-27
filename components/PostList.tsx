'use client';

import Link from 'next/link';
import type { PostSummary } from '@/lib/sn/types';
import { formatRelativeTime } from '@/lib/utils';

interface PostListProps {
  posts: PostSummary[];
  territory: string | null;
  locale: 'en' | 'es';
}

export function PostList({ posts, territory, locale }: PostListProps) {
  const pointsText = locale === 'es' ? 'puntos' : 'points';
  const byText = locale === 'es' ? 'por' : 'by';
  const noPostsText = locale === 'es' ? 'No se encontraron posts' : 'No posts found';

  if (!posts.length) {
    return (
      <div className="text-center py-12 text-gray-500">{noPostsText}</div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const timeAgo = formatRelativeTime(post.createdAt);
        const hrefTerritory = territory || post.territory?.name || 'recent';
        const linkHref = `/post/${post.id}?territory=${encodeURIComponent(hrefTerritory)}`;

        return (
          <Link
            key={post.id}
            href={linkHref}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="font-medium text-blue-600">
                {post.sats} {pointsText}
              </span>
              <span>
                {byText} {post.author}
              </span>
              {timeAgo && <span className="text-gray-400">{timeAgo}</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

'use client';

import { PostItem } from '@/lib/rss';
import Link from 'next/link';

interface PostListProps {
  posts: PostItem[];
  locale: 'en' | 'es';
}

export function PostList({ posts, locale }: PostListProps) {
  const pointsText = locale === 'es' ? 'puntos' : 'points';
  const byText = locale === 'es' ? 'por' : 'by';

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
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="font-medium text-blue-600">
              {post.points} {pointsText}
            </span>
            <span>
              {byText} {post.by}
            </span>
            <span className="text-gray-400">{post.timeAgo}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

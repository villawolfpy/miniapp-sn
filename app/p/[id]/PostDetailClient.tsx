'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { PostDetail } from '@/lib/territories';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  id: string;
}

export function PostDetailClient({ id }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSub = searchParams.get('sub');

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`/api/sn/item?id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return (await res.json()) as { item: PostDetail };
      })
      .then((data) => {
        if (active) setPost(data.item);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  function handleBack() {
    if (fromSub) {
      router.push(`/?sub=${encodeURIComponent(fromSub)}`);
    } else {
      router.push('/');
    }
  }

  if (loading) {
    return (
      <main>
        <button className="btn-back" onClick={handleBack}>
          &larr; Back
        </button>
        <div className="skeleton skeleton-detail-title" />
        <div className="skeleton skeleton-detail-body" />
        <div className="skeleton skeleton-detail-body" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <button className="btn-back" onClick={handleBack}>
          &larr; Back
        </button>
        <div className="card">
          <h2>Unable to load post</h2>
          <p>{error ?? 'Post not found'}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <button className="btn-back" onClick={handleBack}>
        &larr; Back
      </button>

      <article className="detail">
        <h1 className="detail-title">{post.title}</h1>

        <div className="detail-meta">
          <span className="post-sats">{post.sats} sats</span>
          <span>{post.ncomments} comments</span>
          {post.subName ? <span>~{post.subName}</span> : null}
        </div>

        <div className="detail-author">
          by <strong>{post.user.name}</strong>
          <span className="detail-time">
            {formatDate(post.createdAt)} ({timeAgo(post.createdAt)})
          </span>
        </div>

        {post.url ? (
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="btn detail-btn"
          >
            Open Link &rarr;
          </a>
        ) : null}

        {post.text ? (
          <div className="detail-text">
            {post.text.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>
        ) : null}

        <a
          href={`https://stacker.news/items/${post.id}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
        >
          Open on Stacker News
        </a>
      </article>
    </main>
  );
}

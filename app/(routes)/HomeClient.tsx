'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Territory, Post } from '@/lib/territories';

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

export function HomeClient() {
  const searchParams = useSearchParams();
  const initialSub = searchParams.get('sub') ?? '';

  const [subs, setSubs] = useState<Territory[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsError, setSubsError] = useState<string | null>(null);

  const [selected, setSelected] = useState(initialSub);
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Load territories
  useEffect(() => {
    let active = true;
    fetch('/api/sn/subs')
      .then(async (res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return (await res.json()) as { subs: Territory[] };
      })
      .then((data) => {
        if (active) setSubs(data.subs);
      })
      .catch((err: Error) => {
        if (active) setSubsError(err.message);
      })
      .finally(() => {
        if (active) setSubsLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Fetch posts for a territory
  const fetchPosts = useCallback((sub: string) => {
    if (!sub) {
      setPosts([]);
      return;
    }

    let active = true;
    setPostsLoading(true);
    setPostsError(null);
    setPosts([]);

    fetch(`/api/sn/items?sub=${encodeURIComponent(sub)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return (await res.json()) as { items: Post[] };
      })
      .then((data) => {
        if (active) setPosts(data.items);
      })
      .catch((err: Error) => {
        if (active) setPostsError(err.message);
      })
      .finally(() => {
        if (active) setPostsLoading(false);
      });

    return () => { active = false; };
  }, []);

  // Auto-load posts if returning with ?sub=
  useEffect(() => {
    if (initialSub) {
      fetchPosts(initialSub);
    }
  }, [initialSub, fetchPosts]);

  function handleSelect(value: string) {
    setSelected(value);
    setIsOpen(false);
    fetchPosts(value);
  }

  return (
    <main>
      <section className="header">
        <h1>StackerScout</h1>
        <span className="badge">Territories</span>
        <p>Explore Stacker News territories &amp; posts.</p>
      </section>

      {/* Territory selector */}
      <div className="selector-wrap">
        <span className="selector-label">Territory</span>
        {subsLoading ? (
          <div className="skeleton skeleton-select" />
        ) : subsError ? (
          <div className="card">
            <p>Failed to load territories: {subsError}</p>
          </div>
        ) : (
          <div className="dropdown">
            <button
              className="dropdown-trigger"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{selected ? `~${selected}` : 'Select a territory'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
                <path d="M1 1.5l5 5 5-5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen && (
              <ul className="dropdown-list">
                {subs.map((sub) => (
                  <li
                    key={sub.name}
                    className={`dropdown-item${selected === sub.name ? ' dropdown-item--active' : ''}`}
                    onClick={() => handleSelect(sub.name)}
                  >
                    ~{sub.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Posts */}
      {selected ? (
        <section className="posts-section">
          <h2 className="posts-heading">
            ~{selected}
            {!postsLoading && !postsError ? (
              <span className="posts-count">{posts.length} posts</span>
            ) : null}
          </h2>

          {postsLoading ? (
            <div className="list">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-post" />
              ))}
            </div>
          ) : postsError ? (
            <div className="card">
              <p>Unable to load posts: {postsError}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="card">
              <p>No posts in this territory yet.</p>
            </div>
          ) : (
            <div className="list">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/p/${post.id}?sub=${encodeURIComponent(selected)}`}
                  className="post-link"
                >
                  <article className="card post-card">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-meta">
                      <span className="post-sats">{post.sats} sats</span>
                      <span>{post.ncomments} comments</span>
                      <span>by {post.user.name}</span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : !subsLoading && !subsError ? (
        <p className="status">Pick a territory to see its hot posts.</p>
      ) : null}
    </main>
  );
}

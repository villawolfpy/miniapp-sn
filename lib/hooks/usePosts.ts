'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PostSummary, PostsApiResponse } from '@/lib/sn/types';
import {
  getCachedPosts,
  setCachedPosts,
  type CachedPostsPayload,
} from '@/lib/hooks/post-cache';

interface PostsState {
  posts: PostSummary[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  cursor: string | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

function cachePosts(territory: string, posts: PostSummary[], cursor: string | null) {
  const payload: CachedPostsPayload = {
    posts,
    cursor,
    updatedAt: Date.now(),
  };
  setCachedPosts(territory, payload);
}

async function fetchPosts(
  territory: string,
  cursor: string | null,
  limit: number
): Promise<PostsApiResponse> {
  const params = new URLSearchParams({ territory, limit: String(limit) });
  if (cursor) {
    params.set('cursor', cursor);
  }

  const response = await fetch(`/api/sn/posts?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to load posts (${response.status})`);
  }

  return (await response.json()) as PostsApiResponse;
}

export function usePosts(territory: string | null, initialCursor: string | null = null): PostsState {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const territoryRef = useRef<string | null>(territory);

  const pageSize = useMemo(() => 20, []);

  const performFetch = useCallback(
    async (options: { append: boolean; cursor?: string | null }) => {
      if (!territory) return;

      const nextCursor = options.cursor ?? (options.append ? cursor : null);
      const setLoadingState = options.append ? setLoadingMore : setLoading;

      setLoadingState(true);
      if (!options.append) {
        setError(null);
      }

      try {
        const data = await fetchPosts(territory, nextCursor, pageSize);
        const incomingPosts = data.posts || [];
        const mergedPosts = options.append ? [...posts, ...incomingPosts] : incomingPosts;

        setPosts(mergedPosts);
        setCursor(data.cursor ?? null);
        setHasMore(Boolean(data.hasMore));

        cachePosts(territory, mergedPosts, data.cursor ?? null);

        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        if (!options.append) {
          setPosts([]);
        }
        setHasMore(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoadingState(false);
      }
    },
    [cursor, pageSize, posts, territory]
  );

  useEffect(() => {
    if (territoryRef.current !== territory) {
      territoryRef.current = territory;
      const cached = getCachedPosts(territory);
      setPosts(cached?.posts ?? []);
      setCursor(cached?.cursor ?? initialCursor);
      setHasMore(Boolean(cached?.cursor));
      setError(null);
    }

    if (!territory) {
      return;
    }

    void performFetch({ append: false });
  }, [initialCursor, performFetch, territory]);

  const loadMore = useCallback(async () => {
    if (!territory || loadingMore || !hasMore) {
      return;
    }
    await performFetch({ append: true });
  }, [hasMore, loadingMore, performFetch, territory]);

  const refresh = useCallback(async () => {
    if (!territory || loading) {
      return;
    }
    await performFetch({ append: false });
  }, [loading, performFetch, territory]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    cursor,
    loadMore,
    refresh,
  };
}

'use client';

import type { PostSummary } from '@/lib/sn/types';

const STORAGE_NAMESPACE = 'sn-reader.posts';

export interface CachedPostsPayload {
  posts: PostSummary[];
  cursor: string | null;
  updatedAt: number;
}

function getStorageKey(territory: string) {
  return `${STORAGE_NAMESPACE}:${territory}`;
}

export function getCachedPosts(territory: string | null): CachedPostsPayload | null {
  if (typeof window === 'undefined' || !territory) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(getStorageKey(territory));
    if (!raw) return null;
    return JSON.parse(raw) as CachedPostsPayload;
  } catch (error) {
    console.warn('Failed to parse cached posts', error);
    return null;
  }
}

export function setCachedPosts(
  territory: string,
  payload: CachedPostsPayload
): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(getStorageKey(territory), JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to cache posts', error);
  }
}

const API_BASE = process.env.NEXT_PUBLIC_SN_API_BASE ?? 'https://api.sn.dev';

/**
 * Shape of a territory entry returned by the SN API.
 */
export interface Territory {
  id: string;
  name: string;
  description?: string;
}

/**
 * Post object returned from the SN API feed endpoints.
 */
export interface SnPost {
  id: string;
  title: string;
  body?: string;
  territoryId: string;
  territoryName?: string;
  createdAt: string;
  url?: string;
  author?: {
    username: string;
    displayName?: string;
  };
  score?: number;
}

/**
 * Envelope returned by the paginated posts endpoint.
 */
export interface PostsResponse {
  posts: SnPost[];
  nextCursor?: string | null;
}

interface FetchOptions {
  cursor?: string | null;
  territoryId?: string;
  limit?: number;
  token?: string;
}

/**
 * Generic helper that wraps fetch with sensible defaults and error handling.
 */
async function fetchFromSn<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`SN API error ${response.status}: ${message}`);
  }

  return (await response.json()) as T;
}

/**
 * Fetches the available territories so the UI can present a filter menu.
 */
export async function fetchTerritories(token?: string): Promise<Territory[]> {
  const data = await fetchFromSn<{ territories: Territory[] }>(`/territories`, undefined, token);
  return data.territories;
}

/**
 * Retrieves a page of posts, optionally filtered by territory and pagination cursor.
 */
export async function fetchPosts({
  cursor,
  territoryId,
  limit = 20,
  token,
}: FetchOptions = {}): Promise<PostsResponse> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (cursor) params.set('cursor', cursor);
  if (territoryId) params.set('territoryId', territoryId);

  const data = await fetchFromSn<PostsResponse>(`/posts?${params.toString()}`, undefined, token);
  return {
    posts: data.posts ?? [],
    nextCursor: data.nextCursor ?? null,
  };
}

/**
 * Fetches a single post by its identifier, used for the detail screen.
 */
export async function fetchPostById(id: string, token?: string): Promise<SnPost> {
  if (!id) {
    throw new Error('A post identifier is required.');
  }
  return fetchFromSn<SnPost>(`/posts/${id}`, undefined, token);
}

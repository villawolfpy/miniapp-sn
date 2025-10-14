export interface TerritorySummary {
  id: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string | null;
}

export interface PostSummary {
  id: string;
  title: string;
  url?: string | null;
  path: string;
  sats: number;
  author: string;
  createdAt: string;
  commentCount: number;
  territory?: {
    id: string;
    name: string;
    title?: string | null;
  } | null;
}

export interface TerritoriesApiResponse {
  territories: TerritorySummary[];
  error?: string;
}

export interface PostsApiResponse {
  posts: PostSummary[];
  cursor: string | null;
  hasMore: boolean;
  error?: string;
}

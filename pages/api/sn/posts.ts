import type { NextApiRequest, NextApiResponse } from 'next';
import { executeStackerQuery, StackerNewsError } from '@/lib/server/stacker';
import type { PostSummary } from '@/lib/sn/types';

interface PostNode {
  id?: string;
  title?: string;
  url?: string | null;
  path?: string | null;
  sats?: number | null;
  score?: number | null;
  createdAt?: string | null;
  created_at?: string | null;
  commentCount?: number | null;
  comments?: { id?: string }[] | null;
  user?: { name?: string | null; username?: string | null } | null;
  territory?: { id?: string | null; name?: string | null; title?: string | null } | null;
}

interface PostsConnection {
  cursor?: string | null;
  nextCursor?: string | null;
  lastCursor?: string | null;
  pageInfo?: { hasNextPage?: boolean | null; endCursor?: string | null } | null;
  items?: PostNode[] | null;
  edges?: { node?: PostNode | null }[] | null;
}

interface TerritoryPostsData {
  territory?: {
    name?: string | null;
    posts?: PostsConnection | null;
  } | null;
  posts?: PostsConnection | null;
}

interface PostDetailData {
  item?: PostNode | null;
}

interface PostsResponseBody {
  posts: PostSummary[];
  cursor: string | null;
  hasMore: boolean;
  error?: string;
}

const POSTS_QUERY = /* GraphQL */ `
  query MiniAppPosts($name: String!, $cursor: String, $limit: Int!) {
    territory(name: $name) {
      name
      posts(first: $limit, after: $cursor) {
        cursor
        nextCursor
        pageInfo {
          hasNextPage
          endCursor
        }
        items {
          id
          title
          url
          path
          sats
          score
          createdAt
          commentCount
          user {
            name
            username
          }
          territory {
            id
            name
            title
          }
        }
      }
    }
  }
`;

const POST_DETAIL_QUERY = /* GraphQL */ `
  query MiniAppPost($id: ID!) {
    item(id: $id) {
      id
      title
      url
      path
      sats
      score
      createdAt
      commentCount
      user {
        name
        username
      }
      territory {
        id
        name
        title
      }
    }
  }
`;

function normalizePosts(connection: PostsConnection | null | undefined): {
  posts: PostSummary[];
  cursor: string | null;
  hasMore: boolean;
} {
  const nodes =
    connection?.items ||
    connection?.edges?.map((edge) => edge?.node).filter(Boolean) ||
    [];

  const posts: PostSummary[] = (nodes as PostNode[])
    .filter(Boolean)
    .map((post) => {
      const id = post?.id || '';
      const author = post?.user?.name || post?.user?.username || 'anon';
      const createdAt = post?.createdAt || post?.created_at || new Date().toISOString();
      const sats =
        typeof post?.sats === 'number'
          ? post?.sats
          : typeof post?.score === 'number'
          ? post?.score
          : 0;

      return {
        id,
        title: post?.title || 'Untitled',
        url: post?.url ?? null,
        path: post?.path || `/items/${id}`,
        sats,
        author,
        createdAt,
        commentCount: post?.commentCount ?? post?.comments?.length ?? 0,
        territory: post?.territory
          ? {
              id: post.territory.id || post.territory.name || 'territory',
              name: post.territory.name || post.territory.id || 'territory',
              title: post.territory.title || post.territory.name || null,
            }
          : null,
      } satisfies PostSummary;
    });

  const cursor =
    connection?.nextCursor ||
    connection?.cursor ||
    connection?.pageInfo?.endCursor ||
    connection?.lastCursor ||
    null;

  const hasMore = Boolean(connection?.pageInfo?.hasNextPage) || Boolean(cursor);

  return { posts, cursor, hasMore };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostsResponseBody>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ posts: [], cursor: null, hasMore: false, error: 'Method not allowed' });
  }

  const { territory, cursor, limit, id } = req.query;

  try {
    if (id && typeof id === 'string') {
      const data = await executeStackerQuery<PostDetailData>(POST_DETAIL_QUERY, { id });
      const { posts } = normalizePosts({ items: data.item ? [data.item] : [] });
      const post = posts[0];

      if (!post) {
        return res.status(404).json({ posts: [], cursor: null, hasMore: false, error: 'Post not found' });
      }

      return res.status(200).json({ posts: [post], cursor: null, hasMore: false });
    }

    if (!territory || typeof territory !== 'string') {
      return res
        .status(400)
        .json({ posts: [], cursor: null, hasMore: false, error: 'territory query parameter is required' });
    }

    const pageSize = Number(limit) > 0 && Number(limit) <= 50 ? Number(limit) : 20;

    const data = await executeStackerQuery<TerritoryPostsData>(POSTS_QUERY, {
      name: territory,
      cursor: typeof cursor === 'string' ? cursor : null,
      limit: pageSize,
    });

    const connection = data.territory?.posts || data.posts;
    const { posts, cursor: nextCursor, hasMore } = normalizePosts(connection);

    return res.status(200).json({ posts, cursor: nextCursor, hasMore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error fetching posts';

    if (error instanceof StackerNewsError) {
      return res.status(200).json({ posts: [], cursor: null, hasMore: false, error: message });
    }

    return res.status(500).json({ posts: [], cursor: null, hasMore: false, error: message });
  }
}

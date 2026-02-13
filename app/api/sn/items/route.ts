import { NextRequest, NextResponse } from 'next/server';
import { TERRITORY_NAMES } from '@/lib/territories';
import type { Post } from '@/lib/territories';

const SN_API = 'https://stacker.news/api/graphql';

const ITEMS_QUERY = `
  query items($sub: String, $sort: String, $cursor: String) {
    items(sub: $sub, sort: $sort, cursor: $cursor) {
      cursor
      items {
        id
        title
        sats
        createdAt
        ncomments
        user { name }
      }
    }
  }
`;

const allowedSubs = new Set<string>(TERRITORY_NAMES);

export async function GET(req: NextRequest) {
  const sub = req.nextUrl.searchParams.get('sub');
  const cursor = req.nextUrl.searchParams.get('cursor');

  if (!sub) {
    return NextResponse.json(
      { error: 'Missing required query param: sub' },
      { status: 400 }
    );
  }

  if (!allowedSubs.has(sub)) {
    return NextResponse.json(
      { error: `Unknown territory: ${sub}` },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(SN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ITEMS_QUERY,
        variables: { sub, sort: 'hot', cursor: cursor || undefined },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`SN API responded ${res.status} for items(sub: ${sub})`);
      return NextResponse.json(
        { error: 'Stacker News API unavailable' },
        { status: 502 }
      );
    }

    const json = (await res.json()) as {
      data?: {
        items: {
          cursor: string | null;
          items: Post[];
        };
      };
      errors?: unknown[];
    };

    if (json.errors) {
      console.error('SN GraphQL errors (items):', JSON.stringify(json.errors));
    }

    const data = json.data?.items ?? { cursor: null, items: [] };

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error(`Failed to fetch items for ${sub}:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

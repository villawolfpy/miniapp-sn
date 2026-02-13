import { NextRequest, NextResponse } from 'next/server';
import type { PostDetail } from '@/lib/territories';

const SN_API = 'https://stacker.news/api/graphql';

const ITEM_QUERY = `
  query item($id: ID!) {
    item(id: $id) {
      id
      title
      url
      text
      sats
      createdAt
      ncomments
      subName
      user { name }
    }
  }
`;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required query param: id' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(SN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ITEM_QUERY,
        variables: { id },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`SN API responded ${res.status} for item(id: ${id})`);
      return NextResponse.json(
        { error: 'Stacker News API unavailable' },
        { status: 502 }
      );
    }

    const json = (await res.json()) as {
      data?: { item: PostDetail | null };
      errors?: unknown[];
    };

    if (json.errors) {
      console.error('SN GraphQL errors (item):', JSON.stringify(json.errors));
    }

    const item = json.data?.item ?? null;

    if (!item) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error(`Failed to fetch item ${id}:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

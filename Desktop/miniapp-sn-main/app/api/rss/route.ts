import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const runtime = 'edge';

function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function snFeedUrl(territory: string) {
  const map: Record<string, string> = {
    bitcoin: 'https://stacker.news/~bitcoin/rss',
    tech: 'https://stacker.news/~tech/rss',
    nostr: 'https://stacker.news/~nostr/rss',
    meta: 'https://stacker.news/~meta/rss',
    recent: 'https://stacker.news/rss',
  };
  return map[territory] ?? map.recent;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const territory = (searchParams.get('territory') || 'recent').toLowerCase();
    const url = snFeedUrl(territory);

    const res = await fetch(url, {
      headers: { Accept: 'application/rss+xml' },
      cache: 'no-store',
    });
    if (!res.ok)
      return NextResponse.json(
        { error: `Feed fetch failed ${res.status}` },
        { status: 502 }
      );

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const items = (parsed?.rss?.channel?.item || []).map((it: any, i: number) => {
      const description = String(it?.description || '');
      const pointsMatch = description.match(/(\d+)\s+point/);
      const points = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;
      
      const authorMatch = description.match(/by\s+([^\s<]+)/);
      const by = authorMatch ? authorMatch[1] : 'unknown';
      
      const pubDate = String(it?.pubDate ?? '');
      const timeAgo = formatTimeAgo(pubDate);
      
      return {
        id: String(it?.guid ?? i),
        title: String(it?.title ?? ''),
        url: String(it?.link ?? ''),
        points,
        by,
        timeAgo,
      };
    });

    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: { 'Cache-Control': 'public, max-age=60' },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'unknown error' },
      { status: 500 }
    );
  }
}

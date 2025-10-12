import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const runtime = 'edge';

function snFeedUrl(territory: string) {
  const map: Record<string, string> = {
    bitcoin: 'https://stacker.news/bitcoin/rss',
    tech: 'https://stacker.news/tech/rss',
    nostr: 'https://stacker.news/nostr/rss',
    meta: 'https://stacker.news/meta/rss',
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

    const items = (parsed?.rss?.channel?.item || []).map((it: any, i: number) => ({
      id: String(it?.guid ?? i),
      title: String(it?.title ?? ''),
      url: String(it?.link ?? ''),
      points: Number((it?.description || '').match(/(\d+)\s+points?/)?.[1] ?? 0),
      by: String(it?.author || it?.['dc:creator'] || 'unknown'),
      timeAgo: String(it?.pubDate ?? ''),
    }));

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

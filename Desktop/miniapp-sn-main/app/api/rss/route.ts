import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const runtime = 'edge';

const RSS_URLS = {
  bitcoin: 'https://stacker.news/rss',
  tech: 'https://stacker.news/rss?tag=tech',
  nostr: 'https://stacker.news/rss?tag=nostr',
  meta: 'https://stacker.news/rss?tag=meta',
  recent: 'https://stacker.news/rss',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const territory = searchParams.get('territory') || 'bitcoin';
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const rssUrl = RSS_URLS[territory as keyof typeof RSS_URLS] || RSS_URLS.bitcoin;
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status}`);
    }
    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xml);

    const items = result.rss?.channel?.item || [];
    const normalizedItems = items.slice(0, 20).map((item: any, index: number) => ({
      id: item.guid || `${territory}-${index}`,
      title: item.title || '',
      url: item.link || '',
      points: item['stacker:cost'] || 0,
      by: item['dc:creator'] || 'anonymous',
      timeAgo: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'unknown',
    }));

    return NextResponse.json(
      { items: normalizedItems },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        items: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}

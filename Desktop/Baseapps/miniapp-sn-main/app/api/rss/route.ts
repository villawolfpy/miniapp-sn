export const runtime = 'edge';

const TERRITORY_TO_RSS: Record<string, string> = {
  recent: 'https://stacker.news/rss',
  bitcoin: 'https://stacker.news/~bitcoin/rss',
  tech: 'https://stacker.news/~tech/rss',
  nostr: 'https://stacker.news/~nostr/rss',
  meta: 'https://stacker.news/~meta/rss',
};

function parseRss(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item')).map((el) => ({
    id: el.querySelector('guid')?.textContent ?? el.querySelector('link')?.textContent ?? '',
    title: el.querySelector('title')?.textContent ?? '',
    link: el.querySelector('link')?.textContent ?? '',
    pubDate: el.querySelector('pubDate')?.textContent ?? '',
    description: el.querySelector('description')?.textContent ?? '',
  }));
  return { items };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const territory = (url.searchParams.get('territory') || 'recent').toLowerCase();
    const feed = TERRITORY_TO_RSS[territory] ?? TERRITORY_TO_RSS.recent;

    const res = await fetch(feed, {
      headers: { 'User-Agent': 'SN-Reader/1.0 (+https://sn-app-eta.vercel.app/)' },
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ items: [], error: `Upstream ${res.status}` }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    const xml = await res.text();
    const data = parseRss(xml);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ items: [], error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
export interface PostItem {
  id: string;
  title: string;
  url: string;
  points: number;
  by: string;
  timeAgo: string;
  description?: string;
}

export interface RSSResponse {
  items: PostItem[];
  error?: string;
}

export async function fetchStackerNewsRSS(
  territory: string = 'bitcoin',
  page: number = 1
): Promise<RSSResponse> {
  try {
    const rssUrl = territory === 'recent'
      ? 'https://stacker.news/rss'
      : `https://stacker.news/~${territory}/rss`;

    const response = await fetch(rssUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    const items = parseRSS(xmlText);

    return { items };
  } catch (error) {
    console.error('RSS fetch error:', error);
    return {
      items: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function parseRSS(xmlText: string): PostItem[] {
  const items: PostItem[] = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    const title = extractTag(itemContent, 'title');
    const link = extractTag(itemContent, 'link');
    const description = extractTag(itemContent, 'description');
    const pubDate = extractTag(itemContent, 'pubDate');

    const pointsMatch = description?.match(/(\d+)\s+point/);
    const points = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;

    const authorMatch = description?.match(/by\s+([^\s<]+)/);
    const by = authorMatch ? authorMatch[1] : 'unknown';

    const id = link?.split('/').filter(Boolean).pop() || '';

    items.push({
      id,
      title: decodeHtml(title || ''),
      url: link || '',
      points,
      by,
      timeAgo: formatTimeAgo(pubDate || ''),
      description: stripHtml(description || ''),
    });
  }

  return items;
}

function extractTag(content: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function decodeHtml(html: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  return html.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').substring(0, 200);
}

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

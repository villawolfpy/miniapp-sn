import { CACHE_TTL_SECONDS, DEFAULT_TERRITORY } from "./constants";
import { normalizeTerritory } from "./territories";

export type TerritoryFeedItem = {
  title: string;
  link: string;
  isoDate?: string;
  creator?: string;
  sats?: number | null;
  comments?: number | null;
};

export type TerritoryFeed = {
  territory: string;
  items: TerritoryFeedItem[];
};

type CacheEntry = {
  expiresAt: number;
  feed: TerritoryFeed;
};

const feedCache = new Map<string, CacheEntry>();

function decodeHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[(.*?)(\]\]>)?/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractTag(xml: string, tag: string): string | null {
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(pattern);
  if (!match) {
    return null;
  }
  return decodeHtml(match[1]);
}

function parseNumber(value: string | null, pattern: RegExp): number | null {
  if (!value) {
    return null;
  }
  const match = value.match(pattern);
  if (!match) {
    return null;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseItems(xml: string): TerritoryFeedItem[] {
  const items: TerritoryFeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title") ?? "Sin título";
    const link = extractTag(itemXml, "link") ?? "";
    const isoDate = extractTag(itemXml, "pubDate") ?? undefined;
    const creator = extractTag(itemXml, "dc:creator") ?? extractTag(itemXml, "author") ?? undefined;
    const description = extractTag(itemXml, "content:encoded") ?? extractTag(itemXml, "description");

    const sats = parseNumber(description, /(\d+)\s+sats?/i);
    const comments = parseNumber(description, /(\d+)\s+comment/iu);

    items.push({
      title,
      link,
      isoDate,
      creator,
      sats,
      comments,
    });
  }

  return items;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`No se pudo descargar el feed (${response.status})`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchTerritoryFeed(rawTerritory: string): Promise<TerritoryFeed> {
  const territory = normalizeTerritory(rawTerritory) ?? DEFAULT_TERRITORY;
  const now = Date.now();
  const cached = feedCache.get(territory);
  if (cached && cached.expiresAt > now) {
    return cached.feed;
  }

  const url = `https://stacker.news/${territory}/rss`;
  const xml = await fetchWithTimeout(url, 5000);
  const items = parseItems(xml);
  const feed: TerritoryFeed = { territory, items };

  feedCache.set(territory, {
    expiresAt: now + CACHE_TTL_SECONDS * 1000,
    feed,
  });

  return feed;
}

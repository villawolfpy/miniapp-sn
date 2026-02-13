import { NextResponse } from 'next/server';
import { TERRITORY_NAMES, type Territory } from '@/lib/territories';

const SN_API = 'https://stacker.news/api/graphql';

/**
 * Build a single batched GraphQL query using aliases.
 * Each territory gets its own aliased `sub(name:)` call.
 */
function buildBatchQuery(): string {
  const fields = TERRITORY_NAMES.map((name, i) => {
    // GraphQL aliases must be valid identifiers — replace non-alpha with _
    const alias = `t${i}`;
    return `${alias}: sub(name: "${name}") { name desc status nsfw }`;
  });
  return `query BatchSubs { ${fields.join('\n')} }`;
}

export async function GET() {
  try {
    const res = await fetch(SN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: buildBatchQuery() }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`SN API responded ${res.status}`);
      return NextResponse.json(
        { error: 'Stacker News API unavailable' },
        { status: 502 }
      );
    }

    const json = (await res.json()) as {
      data?: Record<string, Territory | null>;
      errors?: unknown[];
    };

    if (json.errors) {
      console.error('SN GraphQL errors:', JSON.stringify(json.errors));
    }

    // Collect non-null results, preserving the order from TERRITORY_NAMES
    const subs: Territory[] = [];
    if (json.data) {
      for (let i = 0; i < TERRITORY_NAMES.length; i++) {
        const sub = json.data[`t${i}`];
        if (sub && sub.status === 'ACTIVE') {
          subs.push(sub);
        }
      }
    }

    return NextResponse.json({ subs }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('Failed to fetch territories:', err);
    return NextResponse.json(
      { error: 'Failed to fetch territories' },
      { status: 500 }
    );
  }
}

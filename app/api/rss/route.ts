import { NextRequest, NextResponse } from 'next/server';
import { fetchStackerNewsRSS } from '@/lib/rss';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const territory = searchParams.get('territory') || 'bitcoin';
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const data = await fetchStackerNewsRSS(territory, page);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
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

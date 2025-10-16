import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'trending';

  // Create a simple SVG image
  const svg = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#1a1a1a"/>
      <text x="50" y="80" font-family="Arial" font-size="32" fill="white">
        📰 Stacker.News ${type === 'latest' ? 'Latest' : 'Trending'}
      </text>
      <text x="50" y="140" font-family="Arial" font-size="24" fill="#ccc">
        ${type === 'latest' ? '🆕 Latest posts from Stacker.News' : '📊 Trending posts from Stacker.News'}
      </text>
      <text x="50" y="200" font-family="Arial" font-size="18" fill="#888">
        Click the buttons below to explore
      </text>
      <text x="50" y="350" font-family="Arial" font-size="14" fill="#666">
        Powered by Stacker.News API
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
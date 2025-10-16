import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    const buttonIndex = untrustedData?.buttonIndex;

    let postsType = 'trending';
    if (buttonIndex === 2) {
      postsType = 'latest';
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?type=${postsType}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          <meta property="fc:frame:button:1" content="📊 Trending Posts" />
          <meta property="fc:frame:button:2" content="🆕 Latest Posts" />
          <meta property="fc:frame:button:3" content="🔄 Refresh" />
          <title>Stacker.News</title>
        </head>
        <body>
          <h1>Stacker.News ${postsType} posts</h1>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        <meta property="fc:frame:button:1" content="📊 Trending Posts" />
        <meta property="fc:frame:button:2" content="🆕 Latest Posts" />
        <title>Stacker.News</title>
      </head>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
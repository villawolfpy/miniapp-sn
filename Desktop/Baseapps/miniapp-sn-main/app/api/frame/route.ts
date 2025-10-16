import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    const buttonIndex = untrustedData?.buttonIndex;

    let postsType = 'trending';
    if (buttonIndex === 2) {
      postsType = 'latest';
    }

    // Return frame response
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://sn-app-eta.vercel.app/api/og?type=${postsType}" />
          <meta property="fc:frame:post_url" content="https://sn-app-eta.vercel.app/api/frame" />
          <meta property="fc:frame:button:1" content="📊 Trending Posts" />
          <meta property="fc:frame:button:2" content="🆕 Latest Posts" />
          <meta property="fc:frame:button:3" content="🔄 Refresh" />
        </head>
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
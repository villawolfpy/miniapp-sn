import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const untrustedData = body.untrustedData;

    const buttonIndex = untrustedData?.buttonIndex || 1;

    let postsType = 'trending';
    if (buttonIndex === 2) postsType = 'latest';
    if (buttonIndex === 3) postsType = 'trending'; // Refresh

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app';

    // Para Frame v2, retornamos HTML con meta tags
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Stacker.News ${postsType}" />
          <meta property="og:image" content="${baseUrl}/api/og?type=${postsType}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?type=${postsType}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          <meta property="fc:frame:button:1" content="📊 Trending" />
          <meta property="fc:frame:button:2" content="🆕 Latest" />
          <meta property="fc:frame:button:3" content="🔄 Refresh" />
        </head>
        <body>
          <h1>Stacker.News ${postsType} Posts</h1>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Frame error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}

// GET handler para el frame inicial
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Stacker.News" />
        <meta property="og:image" content="${baseUrl}/api/og" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        <meta property="fc:frame:button:1" content="📊 Trending" />
        <meta property="fc:frame:button:2" content="🆕 Latest" />
        <meta property="fc:frame:button:3" content="🔄 Refresh" />
      </head>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
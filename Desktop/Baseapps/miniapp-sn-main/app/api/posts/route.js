import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'trending';

  try {
    const query = `
      query {
        items(limit: 10, sort: ${type === 'latest' ? 'created' : 'score'}) {
          id
          title
          url
          user {
            name
          }
          upvotes
          sats
          comments {
            count
          }
          createdAt
        }
      }
    `;

    const response = await fetch('https://stacker.news/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const posts = data.data.items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      user: item.user?.name,
      upvotes: item.upvotes,
      sats: item.sats,
      comments: item.comments?.count || 0,
      createdAt: item.createdAt
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Stacker.news API error:', error);

    // Fallback data
    const fallbackPosts = [
      {
        id: 1,
        title: 'Bitcoin News',
        user: 'satoshi',
        upvotes: 100,
        sats: 1000,
        comments: 25,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Nostr Updates',
        user: 'jack',
        upvotes: 85,
        sats: 500,
        comments: 12,
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(fallbackPosts);
  }
}

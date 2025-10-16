import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'trending';

  try {
    // Stacker.news GraphQL API
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
      throw new Error('Stacker.news API failed');
    }

    const data = await response.json();

    // Transform the data to match our needs
    const posts = data.data.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      user: item.user?.name,
      upvotes: item.upvotes,
      comments: item.comments?.count || 0,
      createdAt: item.createdAt
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);

    // Fallback data in case API fails
    const fallbackPosts = [
      {
        id: 1,
        title: 'Welcome to Stacker.News Mini App',
        user: 'admin',
        upvotes: 42,
        comments: 5,
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(fallbackPosts);
  }
}

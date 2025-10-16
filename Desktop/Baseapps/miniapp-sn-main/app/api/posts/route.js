import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Query simplificada para Stacker.news
    const query = `
      query {
        items(limit: 5, sort: score) {
          id
          title
          upvotes
          comments {
            count
          }
          user {
            name
          }
        }
      }
    `;

    const response = await fetch('https://stacker.news/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    const posts = data.data?.items?.map(item => ({
      id: item.id,
      title: item.title,
      upvotes: item.upvotes,
      comments: item.comments?.count || 0,
      user: item.user?.name
    })) || [];

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error:', error);
    // Fallback data
    return NextResponse.json([
      { id: 1, title: 'Bitcoin News', upvotes: 100, comments: 25, user: 'satoshi' },
      { id: 2, title: 'Nostr Updates', upvotes: 85, comments: 12, user: 'jack' }
    ]);
  }
}

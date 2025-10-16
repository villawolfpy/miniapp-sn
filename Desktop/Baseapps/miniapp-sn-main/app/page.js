export default function Home() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app'}/api/og`} />
        <meta property="fc:frame:post_url" content={`${process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app'}/api/frame`} />
        <meta property="fc:frame:button:1" content="📊 Trending Posts" />
        <meta property="fc:frame:button:2" content="🆕 Latest Posts" />
        <title>Stacker.News Mini App</title>
      </head>
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <div id="app">
          <h1>📰 Stacker.News Posts</h1>
          <div id="posts" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading posts from Stacker.News...
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            async function loadPosts(type = 'trending') {
              const postsDiv = document.getElementById('posts');
              postsDiv.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Loading posts...</div>';

              try {
                const response = await fetch('/api/posts?type=' + type);
                const posts = await response.json();

                if (posts.length === 0) {
                  postsDiv.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No posts found</div>';
                  return;
                }

                postsDiv.innerHTML = posts.map(post => \`
                  <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    margin: 16px 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  ">
                    <div style="
                      font-size: 18px;
                      font-weight: 600;
                      margin-bottom: 8px;
                      color: #333;
                    ">
                      <a href="https://stacker.news/items/\${post.id}" target="_blank" style="color: #333; text-decoration: none;">
                        \${post.title || 'Untitled'}
                      </a>
                    </div>
                    <div style="color: #666; font-size: 14px;">
                      ⬆️ \${post.upvotes || 0} • 💬 \${post.comments || 0} •
                      \${post.user ? 'by ' + post.user : ''}
                    </div>
                  </div>
                \`).join('');
              } catch (error) {
                console.error('Error loading posts:', error);
                postsDiv.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Error loading posts</div>';
              }
            }

            // Load trending posts by default
            loadPosts('trending');
          `
        }} />
      </body>
    </html>
  );
}
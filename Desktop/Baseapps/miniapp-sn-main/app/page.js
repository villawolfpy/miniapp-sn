export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>📰 Stacker.News</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Mini App for Farcaster - Explore trending posts
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Frame Actions:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{
              padding: '12px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }} onClick={() => window.open('/api/frame', '_blank')}>
              📊 Open Frame
            </button>
          </div>
        </div>

        <div id="posts" style={{ textAlign: 'left' }}>
          <p>Loading posts...</p>
        </div>
      </div>

      {/* Meta tags para el Frame */}
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app'}/api/og`} />
        <meta property="fc:frame:post_url" content={`${process.env.NEXT_PUBLIC_URL || 'https://sn-app-eta.vercel.app'}/api/frame`} />
        <meta property="fc:frame:button:1" content="📊 Trending Posts" />
        <meta property="fc:frame:button:2" content="🆕 Latest Posts" />
        <meta property="fc:frame:button:3" content="🔄 Refresh" />
      </head>

      <script dangerouslySetInnerHTML={{
        __html: `
          async function loadPosts() {
            try {
              const response = await fetch('/api/posts');
              const posts = await response.json();
              const postsDiv = document.getElementById('posts');

              if (posts.length === 0) {
                postsDiv.innerHTML = '<p>No posts found</p>';
                return;
              }

              postsDiv.innerHTML = posts.slice(0, 3).map(post => \`
                <div style="
                  background: white;
                  border: 1px solid #e0e0e0;
                  border-radius: 8px;
                  padding: 15px;
                  margin: 10px 0;
                ">
                  <strong>\${post.title || 'Untitled'}</strong>
                  <div style="color: #666; font-size: 14px; margin-top: 5px;">
                    ⬆️ \${post.upvotes || 0} • 💬 \${post.comments || 0}
                  </div>
                </div>
              \`).join('');
            } catch (error) {
              console.error('Error:', error);
              document.getElementById('posts').innerHTML = '<p>Error loading posts</p>';
            }
          }

          loadPosts();
        `
      }} />
    </div>
  );
}
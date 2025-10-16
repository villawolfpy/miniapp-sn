'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  const fetchPosts = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?type=${type}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📰 Stacker.News</h1>
        <p style={styles.subtitle}>Bitcoin & Nostr Community</p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'trending' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('trending')}
        >
          📊 Trending
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'latest' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('latest')}
        >
          🆕 Latest
        </button>
      </div>

      <div style={styles.postsContainer}>
        {loading ? (
          <div style={styles.loading}>Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <div style={styles.postMeta}>
                <span>⬆️ {post.upvotes}</span>
                <span>💬 {post.comments}</span>
                {post.user && <span>👤 {post.user}</span>}
              </div>
              <a
                href={`https://stacker.news/items/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.readMore}
              >
                Read on Stacker.News →
              </a>
            </div>
          ))
        ) : (
          <div style={styles.noPosts}>No posts found</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  title: {
    color: 'white',
    fontSize: '28px',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    fontSize: '14px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    justifyContent: 'center'
  },
  tabButton: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    backdropFilter: 'blur(10px)'
  },
  activeTab: {
    background: 'rgba(255,255,255,0.3)',
    fontWeight: '600'
  },
  postsContainer: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  postCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  postTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#333'
  },
  postMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px'
  },
  readMore: {
    color: '#0070f3',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    color: 'white',
    padding: '40px'
  },
  noPosts: {
    textAlign: 'center',
    color: 'white',
    padding: '40px'
  }
};
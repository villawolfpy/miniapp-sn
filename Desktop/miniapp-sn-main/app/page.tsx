'use client';

import { useState, useEffect } from 'react';
import { ready, signin, composeCast, openUrl } from '@/lib/miniapp';

type PostItem = {
  id: string;
  title: string;
  url: string;
  points: number;
  by: string;
  timeAgo: string;
};

const territories = ['bitcoin', 'tech', 'nostr', 'meta', 'recent'];

export default function Home() {
  const [territory, setTerritory] = useState('bitcoin');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ready();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/rss?territory=${territory}&page=1`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [territory]);

  const handleShare = () => {
    composeCast('Check out SN Reader for Farcaster!');
  };

  const handleSignin = () => {
    signin();
  };

  const handleOpenUrl = (url: string) => {
    openUrl(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e5e5', padding: '16px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>SN Reader</h1>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Territorio:</label>
          <select
            value={territory}
            onChange={(e) => setTerritory(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {territories.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <button onClick={handleShare} style={{ marginRight: '8px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Compartir
          </button>
          <button onClick={handleSignin} style={{ marginRight: '8px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Iniciar sesión
          </button>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'white', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>
                <a href={`/post/${post.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>{post.title}</a>
              </h3>
              <p style={{ margin: '0 0 8px 0', color: '#666' }}>{post.points} puntos por {post.by} hace {post.timeAgo}</p>
              <button onClick={() => handleOpenUrl(post.url)} style={{ padding: '4px 8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                Abrir en Stacker News
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

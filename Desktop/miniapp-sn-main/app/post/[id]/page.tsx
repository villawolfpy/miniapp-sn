'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { openUrl } from '@/lib/miniapp';

type PostItem = {
  id: string;
  title: string;
  url: string;
  points: number;
  by: string;
  timeAgo: string;
};

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rss?territory=recent&page=1');
        const data = await response.json();
        const foundPost = data.items.find((p: PostItem) => p.id === params.id);
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  const handleOpenInSN = () => {
    if (post) {
      openUrl(post.url);
    }
  };

  if (loading) {
    return <div style={{ padding: '16px' }}>Cargando...</div>;
  }

  if (!post) {
    return <div style={{ padding: '16px' }}>Post no encontrado</div>;
  }

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{post.title}</h1>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        {post.points} puntos por {post.by} hace {post.timeAgo}
      </p>
      <button
        onClick={handleOpenInSN}
        style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Abrir en Stacker News
      </button>
    </div>
  );
}

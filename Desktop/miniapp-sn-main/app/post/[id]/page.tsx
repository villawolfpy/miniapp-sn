'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMiniApp } from '@/lib/miniapp';

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
  const host = useMiniApp();
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rss?territory=recent');
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

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (!post) {
    return <div className="p-4">Post no encontrado</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {post.points} puntos por {post.by} • {post.timeAgo}
      </p>
      <button
        onClick={() => host.openUrl(post.url)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Abrir en Stacker News
      </button>
    </div>
  );
}

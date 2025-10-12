'use client';

import { useEffect, useState } from 'react';
import { useMiniApp } from '@/lib/miniapp';

// Removed dynamic = 'force-static' as it conflicts with client-side hooks

type PostItem = {
  id: string;
  title: string;
  url: string;
  points: number;
  by: string;
  timeAgo: string;
};

export default function Home() {
  const host = useMiniApp();
  const [territory, setTerritory] = useState('recent');
  const [items, setItems] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    host.ready();
  }, [host]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/rss?territory=${territory}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Error ${r.status}: ${r.statusText}`);
        }
        return r.json();
      })
      .then((d) => {
        if (d.error) {
          throw new Error(d.error);
        }
        setItems(d.items ?? []);
      })
      .catch((err) => {
        console.error('Error fetching RSS:', err);
        setError(err.message || 'Error al cargar los posts');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [territory]);

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="text-lg font-semibold mb-2">SN Reader</h1>
      <select
        value={territory}
        onChange={(e) => setTerritory(e.target.value)}
        className="border p-2 w-full mb-3"
      >
        <option value="recent">Recent</option>
        <option value="bitcoin">Bitcoin</option>
        <option value="tech">Tech</option>
        <option value="nostr">Nostr</option>
        <option value="meta">Meta</option>
      </select>

      {loading ? (
        <p className="text-center py-4">Cargando…</p>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <button
            className="border px-3 py-1 rounded bg-blue-500 text-white"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetch(`/api/rss?territory=${territory}`)
                .then((r) => r.json())
                .then((d) => setItems(d.items ?? []))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          >
            Reintentar
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No hay posts disponibles</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="border rounded p-3">
              <a
                className="font-medium hover:underline"
                href={it.url}
                target="_blank"
                rel="noreferrer"
              >
                {it.title}
              </a>
              <div className="text-xs opacity-70 mt-1">
                {it.points} pts • {it.by} • {it.timeAgo}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="border px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => host.composeCast({ text: it.title, url: it.url })}
                >
                  Compartir
                </button>
                <button
                  className="border px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => host.openUrl(it.url)}
                >
                  Abrir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

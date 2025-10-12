'use client';

import { useEffect, useState } from 'react';
import { useMiniApp } from '@/lib/miniapp';

export const dynamic = 'force-static';

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

  useEffect(() => {
    host.ready();
  }, [host]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/rss?territory=${territory}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
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
        <p>Cargando…</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="border rounded p-3">
              <a
                className="font-medium"
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
                  className="border px-2 py-1 rounded"
                  onClick={() => host.composeCast({ text: it.title, url: it.url })}
                >
                  Compartir
                </button>
                <button
                  className="border px-2 py-1 rounded"
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

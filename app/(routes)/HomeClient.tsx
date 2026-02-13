'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Territory } from '@/lib/territories';

export function HomeClient() {
  const [subs, setSubs] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/sn/subs')
      .then(async (res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return (await res.json()) as { subs: Territory[] };
      })
      .then((data) => {
        if (active) setSubs(data.subs);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <main>
      <section className="header">
        <h1>Cubey</h1>
        <span className="badge">Territories</span>
        <p>Stacker News territories, live.</p>
      </section>

      {loading ? (
        <div className="list">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      ) : error ? (
        <div className="card">
          <h2>Unable to load territories</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="list">
          {subs.map((sub) => (
            <Link key={sub.name} href={`/t/${encodeURIComponent(sub.name)}`}>
              <article className="card territory-card">
                <div className="territory-header">
                  <h2>~{sub.name}</h2>
                </div>
                {sub.desc ? (
                  <p className="territory-desc">{sub.desc}</p>
                ) : null}
              </article>
            </Link>
          ))}
        </div>
      )}

      <p className="status">
        {!loading && !error ? `${subs.length} territories` : null}
      </p>
    </main>
  );
}

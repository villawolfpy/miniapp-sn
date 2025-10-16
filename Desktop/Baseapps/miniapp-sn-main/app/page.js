'use client';
import { useState, useEffect } from 'react';
import { TERRITORIES } from '@/lib/territories';

export default function HomePage() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Stacker News Territories</h1>
      <TerritoryList />
    </main>
  );
}

function TerritoryList() {
  const [territory, setTerritory] = useState('recent');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetch(`/api/rss?territory=${territory}`)
      .then((r) => r.json())
      .then((data) => {
        if (ignore) return;
        if (data?.error) setError(data.error);
        setItems(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((e) => setError(e?.message ?? 'fetch failed'))
      .finally(() => setLoading(false));
    return () => {
      ignore = true;
    };
  }, [territory]);

  return (
    <section style={styles.section}>
      <div style={styles.buttonContainer}>
        {TERRITORIES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTerritory(t.key)}
            style={{
              ...styles.button,
              ...(territory === t.key ? styles.activeButton : {})
            }}
            aria-pressed={territory === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p style={styles.loading}>Loading posts…</p>}
      {error && <p style={styles.error}>No pudimos leer el RSS: {error}</p>}
      {!loading && !error && items.length === 0 && <p style={styles.noPosts}>No posts found.</p>}

      <ul style={styles.list}>
        {items.map((it) => (
          <li key={it.id} style={styles.listItem}>
            <a href={it.link} target="_blank" rel="noreferrer" style={styles.link}>
              {it.title}
            </a>
            <div style={styles.date}>{it.pubDate}</div>
            {it.description && (
              <p style={styles.description} dangerouslySetInnerHTML={{ __html: it.description }} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  activeButton: {
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  noPosts: {
    textAlign: 'center'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  listItem: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px'
  },
  link: {
    fontSize: '18px',
    fontWeight: '500',
    textDecoration: 'underline',
    color: 'blue',
    display: 'block',
    marginBottom: '5px'
  },
  date: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px'
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.4',
    margin: 0
  }
};
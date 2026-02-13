'use client';

import Link from 'next/link';

interface Props {
  name: string;
}

export function TerritoryClient({ name }: Props) {
  return (
    <main>
      <section className="header">
        <h1>~{name}</h1>
        <p>Posts coming soon.</p>
      </section>

      <div className="card">
        <h2>Territory Posts</h2>
        <p>This view will show live posts from ~{name}. Integration in progress.</p>
      </div>

      <Link href="/">
        <button className="btn">&larr; Back to Territories</button>
      </Link>
    </main>
  );
}

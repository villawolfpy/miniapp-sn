'use client';

export function HomeClient() {
  return (
    <main>
      <section className="header">
        <h1>Cubey</h1>
        <span className="badge">Mini App</span>
        <p>Your AI Ad Companion on Base.</p>
      </section>

      <div className="card">
        <h2>Welcome</h2>
        <p>
          Cubey is getting ready. Business logic and integrations are coming
          soon.
        </p>
      </div>

      <button className="btn" onClick={() => alert('Coming soon!')}>
        Get Started
      </button>

      <p className="status">Shell v0.1 &middot; Base Mini App</p>
    </main>
  );
}

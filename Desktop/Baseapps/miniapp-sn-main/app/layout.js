export const metadata = {
  title: 'SN App',
  description: 'Stacker News territories in a Farcaster Mini App',
  other: {
    // Señales para Farcaster Mini App / Frames vNext
    'fc:miniapp': 'v1',
    'fc:frame': 'vNext',
    'of:accepts:xmtp': '2024-02-01',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: 'transparent' }}>
        {children}
      </body>
    </html>
  );
}
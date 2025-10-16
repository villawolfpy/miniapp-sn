export const metadata = {
  title: 'Stacker.News Mini App',
  description: 'Stacker.News posts in Farcaster',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
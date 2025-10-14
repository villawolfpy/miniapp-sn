# SN Reader — Farcaster Mini App

A Farcaster Mini App for reading Stacker News posts directly within your Farcaster client.

## Features

- Browse Stacker News by territory using the official GraphQL API
- View post details with Farcaster sharing capabilities (MiniKit when available)
- Graceful fallback for regular browsers (read-only mode without Farcaster context)
- Bilingual support (English/Spanish)
- Optimized for mobile (424×695 viewport)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Next.js API routes** proxying Stacker News GraphQL
- **Base MiniKit detection** with postMessage fallback

## Project Structure

```
/app
  /post/[id]/page.tsx         # Post detail view
  /page.tsx                   # Home with territory selector
  /layout.tsx                 # Meta tags & layout
/components
  /PostList.tsx               # Post list component
  /TerritorySelector.tsx      # Territory picker
  /MiniAppProvider.tsx        # Mini App SDK wrapper
/lib
  /miniapp.ts                 # MiniKit integration with graceful fallback
  /hooks/usePosts.ts          # Client hook for paginated posts
  /hooks/useTerritories.ts    # Client hook for territory list
  /hooks/post-cache.ts        # Session cache helpers shared by hooks/pages
  /sn/types.ts                # Shared API response types
  /server/stacker.ts          # Server-side GraphQL helper
/pages/api/sn
  /posts.ts                   # GraphQL proxy for posts (list/detail)
  /territories.ts             # GraphQL proxy for territory catalog
/public
  /icon.svg                   # 192×192 app icon
  /splash.svg                 # 424×695 splash screen
  /og.svg                     # 1200×630 OG image
  /.well-known/farcaster.json # Mini App manifest
  /robots.txt
```

## Environment Variables

Create an `.env.local` file with the Stacker News GraphQL credentials (ask the SN team for an API key if required):

```bash
SN_API_URL=https://stacker.news/api/graphql
SN_API_KEY=your_api_key_here
```

- `SN_API_URL` — GraphQL endpoint for Stacker News (default shown above).
- `SN_API_KEY` — Bearer token for authenticated access. Leave blank if your endpoint does not require a key.

These variables are only used on the server (Next.js API routes) and are never exposed to the browser.

## Development

### Installation

```bash
npm install
```

Create a `.env.local` file (see [Environment Variables](#environment-variables)) before running the dev server so the API routes can proxy requests correctly.

### Local Development

Since Mini Apps require an iframe context, you'll need to expose your local dev server:

#### Option 1: Cloudflared Tunnel

```bash
# Install cloudflared
brew install cloudflared  # macOS
# or download from https://github.com/cloudflare/cloudflared/releases

# Start Next.js dev server
npm run dev

# In another terminal, create tunnel
cloudflared tunnel --url http://localhost:3000
```

#### Option 2: ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start Next.js dev server
npm run dev

# In another terminal, create tunnel
ngrok http 3000
```

### Update URLs

Before deploying or testing, update these files with your actual domain:

1. **app/layout.tsx**: Update `fc:miniapp`, `fc:frame:button:1:target`, and `fc:frame:image` URLs
2. **public/.well-known/farcaster.json**: Update all URLs (iconUrl, homeUrl, splash.imageUrl, appUrl)

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

After deployment, update all URLs in the files mentioned above with your production domain.

> **Important:** Remember to configure `SN_API_URL` and `SN_API_KEY` in the Vercel project settings (Project → Settings → Environment Variables) before the production deploy. Redeploy after changing secrets so the serverless functions receive the new values.

## Verification Checklist

Run these commands after deploying to verify your Mini App configuration:

### 1. Check Meta Tags

```bash
curl -sS https://your-domain.com/ | grep -i 'fc:miniapp\|fc:frame'
```

**Expected output:**
- Should find `fc:miniapp` meta tag with your domain
- Should find `fc:frame` meta tag with value `vNext`
- Should find `fc:frame:button:1` and related frame tags

### 2. Check Manifest

```bash
curl -I https://your-domain.com/.well-known/farcaster.json
```

**Expected output:**
```
HTTP/2 200
content-type: application/json
access-control-allow-origin: *
```

```bash
curl -s https://your-domain.com/.well-known/farcaster.json | jq
```

**Expected output:**
```json
{
  "name": "SN Reader",
  "iconUrl": "https://your-domain.com/icon.svg",
  "homeUrl": "https://your-domain.com",
  "splash": {
    "imageUrl": "https://your-domain.com/splash.svg",
    "backgroundColor": "#1e40af"
  },
  "appUrl": "https://your-domain.com",
  "author": {
    "name": "SN Reader Team",
    "url": "https://your-domain.com"
  }
}
```

### 3. Check Assets

```bash
curl -I https://your-domain.com/icon.svg
curl -I https://your-domain.com/splash.svg
curl -I https://your-domain.com/og.svg
```

**Expected output for all:** `HTTP/2 200`

### 4. Check API Endpoints

```bash
curl -s https://your-domain.com/api/sn/territories | jq
curl -s 'https://your-domain.com/api/sn/posts?territory=bitcoin' | jq '.posts | length'
```

**Expected output:**

- The territories endpoint returns a JSON array of territories
- The posts endpoint returns a `posts` array and pagination cursor

### 5. Test in Farcaster

1. Share your domain URL in a cast
2. The cast should display:
   - 3:2 aspect ratio image (OG image)
   - "Open Mini App" button
3. Click the button to open the Mini App in a modal
4. The app should:
   - Hide the splash screen after `ready()` is called
   - Display the territory selector and post list
   - Allow navigation to post details
5. Test `Sign In` button (if host supports it)
6. Test `Share` button in post detail (should call `composeCast()`)

## Mini App SDK Functions

The app uses these Mini App SDK functions via the `useMiniApp()` hook (with graceful fallbacks when MiniKit is unavailable):

- **ready()** — hides the splash screen when embedded inside a Farcaster client
- **signin()** — prompts Farcaster authentication (no-op on web browsers)
- **composeCast(text)** — opens the Farcaster composer or copies content to the clipboard
- **openUrl(url)** — opens external URLs using MiniKit or `window.open`
- **close()** — closes the Mini App modal if supported by the host
- **viewProfile(fid)** — opens a Farcaster profile when available

## Configuration

- **Territories:** Retrieved dynamically from Stacker News GraphQL via `/api/sn/territories`. The client automatically selects the first territory returned by the API.
- **i18n:** Translations live in `lib/i18n.ts` (English/Spanish). Extend the `translations` object to add more languages.

## Troubleshooting

### Meta tags not showing

- Ensure you're checking the actual HTML source, not browser dev tools (Next.js may hydrate differently)
- Check that `app/layout.tsx` has the correct `metadata` export

### Manifest 404

- Ensure `public/.well-known/farcaster.json` exists
- Check `next.config.js` headers configuration
- Verify `vercel.json` rewrites

### Mini App SDK not working

- The app must be loaded in an iframe context (Farcaster client)
- Check browser console for postMessage errors
- Ensure `MiniAppProvider` wraps your components

### GraphQL API errors

- Check `/api/sn/territories` and `/api/sn/posts` responses in the browser dev tools
- Verify `SN_API_URL` and `SN_API_KEY` are set in your environment (and on Vercel)
- Inspect server logs for `StackerNewsError` messages (invalid key or query)

## References

- [Farcaster Mini Apps Specification](https://miniapps.farcaster.xyz/docs/specification)
- [Farcaster Frames Documentation](https://docs.farcaster.xyz/reference/frames-redirect)
- [Stacker News](https://stacker.news)
- [GitHub Repository](https://github.com/villawolfpy/sn1) (reference implementation)

## License

MIT

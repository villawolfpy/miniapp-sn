# SN Reader — Farcaster Mini App

A Farcaster Mini App for reading Stacker News posts directly within your Farcaster client.

## Features

- Browse Stacker News by territory (Bitcoin, Tech, Nostr, Meta, Recent)
- View post details with sharing capabilities
- Native integration with Farcaster via Mini Apps SDK
- Bilingual support (English/Spanish)
- Optimized for mobile (424×695 viewport)
- Edge-optimized API with caching

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Edge Runtime** for API routes
- **Farcaster Mini Apps SDK** (postMessage-based)

## Project Structure

```
/app
  /api/rss/route.ts          # Edge API for RSS fetching
  /post/[id]/page.tsx         # Post detail view
  /page.tsx                   # Home with territory selector
  /layout.tsx                 # Meta tags & layout
/components
  /PostList.tsx               # Post list component
  /TerritorySelector.tsx      # Territory picker
  /MiniAppProvider.tsx        # Mini App SDK wrapper
/lib
  /miniapp.ts                 # SDK hooks (ready, signin, composeCast, etc.)
  /i18n.ts                    # Bilingual strings
  /rss.ts                     # RSS fetching & parsing
/public
  /icon.png                   # 192×192 app icon
  /splash.png                 # 424×695 splash screen
  /og.png                     # 1200×630 OG image
  /.well-known/farcaster.json # Mini App manifest
  /robots.txt
```

## Development

### Installation

```bash
npm install
```

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
  "iconUrl": "https://your-domain.com/icon.png",
  "homeUrl": "https://your-domain.com",
  "splash": {
    "imageUrl": "https://your-domain.com/splash.png",
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
curl -I https://your-domain.com/icon.png
curl -I https://your-domain.com/splash.png
curl -I https://your-domain.com/og.png
```

**Expected output for all:** `HTTP/2 200`

### 4. Check API Endpoint

```bash
curl -s https://your-domain.com/api/rss?territory=bitcoin | jq '.items | length'
```

**Expected output:** Number of posts (e.g., `20`)

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

### 6. Check Headers

```bash
curl -I https://your-domain.com/api/rss?territory=bitcoin
```

**Expected output:** Should include `Cache-Control` header

## Mini App SDK Functions

The app uses these Mini App SDK functions via `useMiniApp()` hook:

- **ready()**: Called on mount to hide splash screen
- **signin()**: Requests user authentication (if supported by host)
- **composeCast(text)**: Opens cast composer with pre-filled text
- **openUrl(url)**: Opens external URL
- **close()**: Closes the Mini App modal
- **viewProfile(fid)**: Opens user profile

## Configuration

### Environment Variables

No environment variables are required. The app uses public Stacker News RSS feeds.

### Territories

Available territories are configured in `components/TerritorySelector.tsx`:

- bitcoin
- tech
- nostr
- meta
- recent (all posts)

Add more by editing the `TERRITORIES` array.

### i18n

Translations are in `lib/i18n.ts`. Currently supports:

- English (en)
- Spanish (es)

Add more languages by extending the `translations` object.

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

### RSS API errors

- Check network tab for API response
- Verify Stacker News RSS feeds are accessible
- Check `lib/rss.ts` parsing logic

## References

- [Farcaster Mini Apps Specification](https://miniapps.farcaster.xyz/docs/specification)
- [Farcaster Frames Documentation](https://docs.farcaster.xyz/reference/frames-redirect)
- [Stacker News](https://stacker.news)
- [GitHub Repository](https://github.com/villawolfpy/sn1) (reference implementation)

## License

MIT

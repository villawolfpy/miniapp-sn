# SN Reader — Base Mini App

A Base Mini App for reading Stacker News posts inside any MiniKit-compatible host. The experience is optimised for the Base Mini Apps platform with wallet verification, tipping flows, and lightweight UI primitives tailored for embedded mobile experiences.

## Features

- Browse Stacker News by territory (Bitcoin, Tech, Nostr, Meta, Recent)
- View post details with wallet-backed share proofs
- Request wallet signatures and validate them via MiniKit before processing actions
- Send optional Base tips (0.0001 ETH) through the connected wallet using MiniKit
- Bilingual interface (English/Spanish) with responsive layout for 424×695 viewports
- Edge-friendly API endpoint with caching for RSS parsing

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MiniKit SDK** for Base Mini Apps (lifecycle + wallet integrations)
- **Edge Runtime** for API routes

## Project Structure

```
/base-mini-app.json          # Base Mini App manifest
/app
  /api/rss/route.ts          # Edge API for RSS fetching
  /post/[id]/page.tsx        # Post detail view with signing & tipping helpers
  /page.tsx                  # Home with territory selector & wallet status
  /layout.tsx                # Meta tags & layout
/components
  /PostList.tsx              # Post list component
  /TerritorySelector.tsx     # Territory picker
  /MiniAppProvider.tsx       # MiniKit orchestration & context provider
/lib
  /miniapp.ts                # Shared MiniKit types & context hook
  /i18n.ts                   # Bilingual strings
  /rss.ts                    # RSS fetching & parsing
  /utils.ts                  # UI helpers
/public
  /icon.svg                  # 192×192 app icon
  /splash.svg                # 424×695 splash screen
  /og.svg                    # 1200×630 OG image
  /.well-known/farcaster.json# Legacy Farcaster manifest (optional)
```

## Development

### Installation

```bash
npm install
```

### Local Development

Mini Apps run within an iframe context. Expose your local dev server before testing in a host.

#### Option 1: Cloudflared Tunnel

```bash
npm run dev
cloudflared tunnel --url http://localhost:3000
```

#### Option 2: ngrok

```bash
npm run dev
ngrok http 3000
```

### Update URLs

Before deploying or testing, replace placeholder domains with your own:

1. **base-mini-app.json**: `appUrl`, `iconUrl`, and `splash.imageUrl`
2. **app/layout.tsx**: Social preview URLs (OG image)
3. **public/.well-known/farcaster.json** (optional legacy support)

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

## Deployment

Deploy to any static-friendly platform (Vercel recommended). After deployment, update the URLs mentioned above to point to your production domain.

## Verification Checklist

1. **Manifest** – ensure it is served correctly
   ```bash
   curl -s https://your-domain.com/base-mini-app.json | jq
   ```
   Confirm permissions include `wallet.requestAccounts`, `wallet.signMessage`, `wallet.verifyMessage`, and `base.sendTransaction`.

2. **Assets** – make sure Base hosts can fetch required assets
   ```bash
   curl -I https://your-domain.com/icon.svg
   curl -I https://your-domain.com/splash.svg
   curl -I https://your-domain.com/og.svg
   ```

3. **API Endpoint** – confirm RSS data is reachable
   ```bash
   curl -s https://your-domain.com/api/rss?territory=bitcoin | jq '.items | length'
   ```

4. **MiniKit Behaviour** – inside a compatible host
   - `ready()` hides the splash screen after the app mounts
   - `connectWallet()` requests accounts, signs a challenge, and validates the signature via MiniKit
   - `signMessage()` re-validates signatures before exposing them to the UI
   - `sendTransaction()` submits a Base transaction (tip button) and surfaces the hash to the user

## MiniKit Helpers

The provider exposes these helpers through `useMiniApp()`:

- `ready()` – notify the host that rendering is complete
- `connectWallet()` – request wallet connection + signature verification
- `signMessage(message)` – sign arbitrary content and ensure the host validates it
- `openUrl(url)` – open external content via the host
- `close()` – close the Mini App view
- `sendTransaction(tx)` – forward Base transactions through the host wallet
- `clearError()` – reset error state shown in the UI

## Troubleshooting

- **MiniKit not detected**: Make sure you are loading the app inside a MiniKit-compatible host. The standalone page will show a fallback message.
- **Signature verification errors**: Hosts must support `wallet.verifyMessage`. Replace the placeholder tip address/value if you plan to use a different payout target.
- **Transaction rejections**: Ensure the connected wallet has Base ETH to cover the 0.0001 ETH tip and gas costs.

## License

MIT

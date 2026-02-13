# Stacker News Territories Mini App

A Farcaster Mini App that lists Stacker News territories (subs) and their posts, backed by the SN GraphQL API.

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env.local`

```bash
SN_BASE_URL=https://stacker.news
SN_API_KEY=your_api_key_here
NEXT_PUBLIC_URL=https://miniapp-sn.vercel.app
# Optional: Farcaster account association (recommended for Mini Apps)
# FC_ACCOUNT_ASSOCIATION_HEADER=...
# FC_ACCOUNT_ASSOCIATION_PAYLOAD=...
# FC_ACCOUNT_ASSOCIATION_SIGNATURE=...
```

3. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## API Routes

- `GET /api/territories/top?when=week|month|year|all&from=&to=&by=`
- `GET /api/territories/all`
- `GET /api/territories/[name]/posts?sort=top|new|discussed&cursor=`
- `POST /api/sn/graphql`

## Mini App Manifest

The manifest is served at `/.well-known/farcaster.json` from a route handler and uses `NEXT_PUBLIC_URL`
to build absolute URLs. Set optional `FC_ACCOUNT_ASSOCIATION_*` env vars to include the signed association.

## Vercel Deploy

1. Push to GitHub.
2. Create a new Vercel project.
3. Set environment variables:
   - `SN_BASE_URL`
   - `SN_API_KEY`
4. Deploy.

## Verification Checklist

- `/.well-known/farcaster.json` returns JSON with `frame.version = "1"`.
- `fc:miniapp` meta tag present on `/` and `/t/[name]`.
- No `fc:frame:*` tags anywhere.
- Home loads 20+ territories via `/api/territories/top`.
- Territory page loads posts via `/api/territories/[name]/posts`.
- `SN_API_KEY` is only read server-side (never exposed to client).

## Tests

```bash
npm run test
```

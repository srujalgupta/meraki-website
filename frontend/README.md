# Meraki Tribe Frontend

React + Vite frontend for The Meraki Tribe travel site.

## Requirements

- Node.js 18 or newer

## Environment

Create `frontend/.env` if you need a custom backend URL.

```env
VITE_API_URL=https://your-api-domain.com
```

If `VITE_API_URL` is not set:

- development uses `http://localhost:5000`
- production uses the current site origin

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Deployment Notes

- Netlify-style SPA fallback is provided via `public/_redirects`
- Vercel rewrite fallback is provided via `vercel.json`
- Set `VITE_API_URL` when frontend and backend are hosted on different domains
- If frontend and backend share the same domain, the production default works without `VITE_API_URL`

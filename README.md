# Meraki Tribe

Production-ready travel website setup for The Meraki Tribe.

## Project Structure

- `frontend/`: React + Vite website
- `backend/`: Express API with MongoDB support and bundled sample-data fallback

## Requirements

- Node.js 18 or newer
- npm 9 or newer recommended

## Local Setup

### 1. Backend

Copy `backend/.env.example` to `backend/.env` and set values as needed.

Important backend envs:

- `NODE_ENV=development` for local work, `production` on the server
- `MONGO_URI=` can be left empty to run in read-only sample-data mode
- `CLIENT_ORIGINS=` should include your frontend URL
- `GOOGLE_PLACES_API_KEY=` and `GOOGLE_PLACES_PLACE_ID=` are optional for live Google reviews

Run:

```bash
cd backend
npm install
npm start
```

Health check:

```bash
GET /health
```

### 2. Frontend

Copy `frontend/.env.example` to `frontend/.env` only if you need a custom API URL.

Run:

```bash
cd frontend
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm run build
npm run check
```

## Deployment Checklist

### Frontend

- Build command: `npm run build`
- Output directory: `dist`
- Local development automatically targets `http://<current-host>:5000`
- On Vercel, set `API_ORIGIN=https://your-render-service.onrender.com` so `/api/*` proxies to Render
- Set `VITE_API_URL` only when you want the frontend to call a backend origin directly instead of the Vercel proxy
- Netlify fallback is included with `frontend/public/_redirects`
- Vercel fallback is included with `frontend/vercel.json`

### Backend

- Start command: `npm start`
- Use Node.js 18+
- Set `NODE_ENV=production`
- Set `CLIENT_ORIGINS` to your deployed frontend origin
- `CLIENT_ORIGINS` can include wildcards such as `https://*.vercel.app`
- Set `MONGO_URI` for live editable trip data
- Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACES_PLACE_ID` if you want live Google reviews
- Keep `MONGO_URI` empty only if you intentionally want bundled sample-data mode

## Vercel + Render Setup

### Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `API_ORIGIN=https://your-render-service.onrender.com`
- Optional environment variable: `VITE_API_URL=` leave empty when using the Vercel proxy

### Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Required environment variables:
  - `NODE_ENV=production`
  - `PORT=10000` or leave unset and let Render inject it
  - `CLIENT_ORIGINS=https://your-site.vercel.app,https://*.vercel.app`
  - `MONGO_URI=...` for live trip data
  - `GOOGLE_PLACES_API_KEY=...`
  - `GOOGLE_PLACES_PLACE_ID=...`

### Local

- Backend: `cd backend && npm start`
- Frontend: `cd frontend && npm run dev`
- No frontend env file is required for the usual local setup

## Current Readiness

Automated checks completed in this workspace:

- frontend build
- frontend lint
- backend health route
- backend core route smoke tests
- malformed JSON request handling
- basic deployment routing fallbacks

Manual checks still recommended before launch:

- mobile testing on a real phone
- browser testing in Chrome and Safari
- final content proofreading
- production domain/env verification
- database write-flow check if MongoDB will be used live

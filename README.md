# WeReadAura

WeReadAura is a minimal MVP for a personal WeRead reading analytics tool.

It turns bookshelf, reading stats, highlights, notes, and recommendations into a plain neo-brutalist dashboard inspired by Gumroad's current homepage language: bold structure, black borders, hard shadows, short copy, and strong CTAs.

## Current Status

This repository is in an early but runnable MVP stage.

What is already implemented:

- Next.js App Router app
- Plain neo-brutalism design tokens and base components
- Overview dashboard
- Bookshelf page
- Reading stats page
- Highlights and notes page
- Discover page
- Book detail page
- Settings page
- Mock API routes for the MVP data shape

What is not implemented yet:

- Persistent database
- User authentication beyond the planned architecture
- Durable sync persistence (in-memory cache only for now)
- Export/report generation

## Tech Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- App Router + Route Handlers

The technical direction is documented in [docs/technical-architecture.md](D:\WeReadAura\docs\technical-architecture.md).

## WeRead Skill Integration

WeReadAura connects to the official [WeRead Skill](https://weread.qq.com/r/weread-skills) Agent API Gateway.

1. Log in at [weread.qq.com/r/weread-skills](https://weread.qq.com/r/weread-skills) and copy your API key (`wrk-...`).
2. Either set `WEREAD_API_KEY` in `.env.local` (see `.env.example`) or save the key on **Settings**.
3. Open **Settings** and click **Sync now** to pull shelf, stats, highlights, and recommendations.

Without a key, the app keeps using mock data for layout and development.

## Run Locally

Requirements:

- `Node.js 24+`
- `npm 11+`

Install dependencies:

```bash
npm install
cp .env.example .env.local
```

Start the dev server:

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

Useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Project Structure

```text
WeReadAura/
  docs/                  Product, design, and architecture docs
  src/
    app/                 App Router pages and API routes
    components/          Shared UI, layout, and chart components
    lib/                 Types, formatters, and mock fallback data
    server/              WeRead adapter, sync, and reading-data services
  AGENTS.md              Project engineering rules
  README.md              Project overview and onboarding
```

Important paths:

- [src/app/page.tsx](D:\WeReadAura\src\app\page.tsx): dashboard home
- [src/app/bookshelf/page.tsx](D:\WeReadAura\src\app\bookshelf\page.tsx): bookshelf view
- [src/app/stats/page.tsx](D:\WeReadAura\src\app\stats\page.tsx): reading stats
- [src/app/notes/page.tsx](D:\WeReadAura\src\app\notes\page.tsx): highlights and notes
- [src/app/discover/page.tsx](D:\WeReadAura\src\app\discover\page.tsx): search and recommendations
- [src/app/books/[bookId]/page.tsx](D:\WeReadAura\src\app\books\[bookId]\page.tsx): single-book profile
- [src/app/settings/page.tsx](D:\WeReadAura\src\app\settings\page.tsx): sync/settings surface
- [src/lib/mock-data.ts](D:\WeReadAura\src\lib\mock-data.ts): MVP mock dataset
- [src/app/globals.css](D:\WeReadAura\src\app\globals.css): global visual tokens and brutalist styles

## Docs Index

- Product requirements: [docs/weread-reading-analytics-prd.md](D:\WeReadAura\docs\weread-reading-analytics-prd.md)
- Frontend visual style guide: [docs/frontend-visual-style-guide.md](D:\WeReadAura\docs\frontend-visual-style-guide.md)
- Technical architecture: [docs/technical-architecture.md](D:\WeReadAura\docs\technical-architecture.md)
- Engineering rules: [AGENTS.md](D:\WeReadAura\AGENTS.md)

## MVP Scope

The app is mock-first until you connect WeRead:

- Pages and API routes are real
- With an API key + sync, live WeRead data replaces mocks in memory
- Without a key, mock data keeps the UI usable offline

## Design Direction

The UI follows a plain neo-brutalism system:

- paper-like background
- thick black borders
- hard offset shadows
- large direct typography
- minimal gradients
- strong section boundaries

Reference rules live in [docs/frontend-visual-style-guide.md](D:\WeReadAura\docs\frontend-visual-style-guide.md).

## API Surface

The MVP currently exposes internal route handlers under `src/app/api`.

Available routes:

- `GET /api/dashboard`
- `GET /api/bookshelf`
- `GET /api/stats`
- `GET /api/notes`
- `GET /api/books/[bookId]`
- `GET /api/discover/search`
- `GET /api/discover/recommendations`
- `POST /api/sync`
- `GET /api/settings`
- `PATCH /api/settings`

Routes read from `src/server/services/reading-data.ts`, which serves synced WeRead data or mock fallbacks.

## Next Steps

1. Add PostgreSQL persistence and sync snapshots.
2. Add tests for transform and analytics logic.
3. Wire interactive search/filter UI to the existing API query params.

## Notes

- The repository may contain local build output like `.next/` from recent verification runs.
- Generated output and dependencies are ignored by `.gitignore`.

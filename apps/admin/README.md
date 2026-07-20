# Lumen Admin App

`apps/admin` is the internal administration dashboard for the Lumen platform. It is a Vite + React 19 single-page application (SPA) for content creators and system administrators.

## Overview

- A fast, lightweight SPA (no SSR) used by staff to manage platform content and users.
- Talks to the same NestJS backend REST API as the web app (`@lumen/shared-api` + `@lumen/uikit`).
- Theming via `next-themes` (light/dark) for parity with the public app.

## Feature Areas

- User Management: view and manage users, roles, and accounts.
- Content Management: create and edit grammar topics, reading articles, vocabulary decks, TOEIC questions, and dictation materials (rich-text editing via Tiptap).
- Analytics Overview: high-level system statistics and charts.

## Tech Stack

- Vite + React 19 (SPA)
- React Router v7 for client-side routing
- Tailwind CSS v4, `@lumen/uikit` (base-ui based design system)
- TanStack Query for server state
- TanStack Table for data grids
- Tiptap for rich-text editing
- Recharts for dashboards
- Zustand for client state, Zod + React Hook Form for forms
- `sonner` for toasts, `date-fns` for dates
- oxlint for linting

## Getting Started

From the frontend workspace root:

```bash
pnpm install
pnpm --filter admin dev        # or: cd apps/admin && pnpm dev
```

It expects the backend running at the configured `BACKEND_URL` and typically serves on a separate port from the web app (Vite default).

## Scripts (in `apps/admin`)

- `pnpm dev` - Vite dev server.
- `pnpm build` - type-check (`tsc -b`) and production build.
- `pnpm preview` - preview the production build.
- `pnpm lint` - oxlint.

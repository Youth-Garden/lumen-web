# Lumen Frontend Monorepo

The Lumen frontend is a monorepo managed by Turborepo and pnpm workspaces. It contains multiple applications and shared internal packages for the Lumen learning platform.

## Workspace Layout

### Applications (`apps/`)

- `web` - The primary student-facing platform (Next.js 16, App Router). See `apps/web/README.md`.
- `admin` - The internal administrative dashboard (Vite + React 19 SPA). See `apps/admin/README.md`.

### Packages (`packages/`)

- `uikit` - Custom design system and shared UI components (Tailwind CSS v4, base-ui).
- `shared-api` - Centralized API bindings, Axios clients, and data transfer objects (DTOs) shared by both apps.
- `hooks` - Shared React hooks used across all apps.
- `utils` - Generic helpers (string formatting, common logic).
- `eslint-config` - Centralized ESLint configuration for consistency.
- `typescript-config` - Shared `tsconfig.json` base configurations.

## Tooling

- Turborepo - build caching, task pipelines, and parallel execution.
- pnpm workspaces - dependency and package linking (`workspace:*`).
- Prettier - formatting (`pnpm format` / `pnpm format:check`).

## Getting Started

Install once from the frontend root:

```bash
pnpm install
pnpm run dev      # runs apps/web (and other configured apps) in development
pnpm run build    # builds the web app (filter with pnpm --filter <app>)
pnpm run lint     # lints the web app
```

Run a single app directly:

```bash
pnpm --filter web dev
pnpm --filter admin dev
```

## Key Technologies (shared)

- React 19
- Tailwind CSS v4
- Framer Motion (web)
- TanStack Query
- Zod + React Hook Form
- `next-intl` (web i18n)

## Notes

- Both apps depend on the backend at `BACKEND_URL`. The web app additionally requires `FRONTEND_URL` for cookie/CSRF and Google OAuth callbacks.
- The `web` app is the only one with SSR and i18n; `admin` is a pure client-side SPA.

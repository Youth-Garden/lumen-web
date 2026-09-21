# Lumen Frontend Monorepo

The Lumen frontend is a monorepo managed by Turborepo and pnpm workspaces. It houses the student-facing web application and shared internal packages for the Lumen vocabulary platform.

## Workspace Layout

### Applications (`apps/`)

- `web` - The primary student-facing web platform & PWA (Next.js 16, App Router, React 19). See `apps/web/README.md`.

### Packages (`packages/`)

- `uikit` - Custom design system and shared UI components (Tailwind CSS v4, Base UI).
- `shared-api` - Centralized API bindings, Axios clients, BaseResponse schemas, and typed `extractApiErrors`.
- `hooks` - Comprehensive React hooks library (`useKeyPress`, `useBreakpoint`, `useNetworkState`, `useLongPress`, `useCountdown`, `useContinuousRetry`, `useDocumentTitle`, `useFavicon`, `usePreferredLanguage`, etc.).
- `utils` - Generic helpers (timing, string formatting, date utilities).
- `eslint-config` - Centralized ESLint configuration for consistency.
- `typescript-config` - Shared `tsconfig.json` base configurations.

## Tooling & Testing

- Turborepo - build caching, task pipelines, and parallel execution.
- Vitest - ultra-fast Unit and React Hook testing (`pnpm test` / `pnpm run test`) with `@testing-library/react` and `jsdom`. All test files are located in dedicated `__tests__/` subfolders.
- pnpm workspaces - dependency and package linking (`workspace:*`).
- Prettier & ESLint - formatting and static analysis (`pnpm format` / `pnpm run lint`).

## Getting Started

Install once from the frontend root:

```bash
pnpm install
pnpm run dev      # runs apps/web in development
pnpm test         # runs all Vitest unit and hook tests across apps and packages
pnpm run build    # builds the web app
pnpm run lint     # lints the web app
```

Run web app commands directly:

```bash
pnpm --filter web dev
pnpm --filter web test
pnpm --filter web build
```

## Key Technologies

- Next.js 16 (App Router) & React 19
- Tailwind CSS v4
- Framer Motion
- TanStack Query
- Zustand & React Hook Form + Zod
- `next-intl` (i18n: en/vi)
- Base UI

## Notes

- The web app connects to the NestJS backend via `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000`).
- Supports PWA installation, dark/light themes, offline state handling, and keyboard navigation shortcuts.

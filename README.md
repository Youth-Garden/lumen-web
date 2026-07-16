# Lumen Frontend Monorepo

The Lumen frontend is a modern web application structured as a monorepo using [Turborepo](https://turbo.build/repo). It contains multiple [Next.js](https://nextjs.org/) applications and shared internal packages, providing a cohesive and scalable B2B learning platform.

## Architecture

The monorepo uses `pnpm` workspaces and contains the following structure:

### Applications (`apps/`)
- `web`: The primary B2B student-facing platform (Next.js, App Router).
- `admin`: The internal administrative dashboard.

### Packages (`packages/`)
- `uikit`: Custom Design System and shared UI components (Tailwind, Radix, base-ui).
- `shared-api`: Centralized API bindings, Axios clients, and data transfer objects (DTOs).
- `hooks`: Shared React hooks utilized across all apps.
- `utils`: Generic helper functions, string formatting, and common logic.
- `eslint-config`: Centralized ESLint configurations for consistency.
- `typescript-config`: Shared `tsconfig.json` configurations.

## Getting Started

1. Install dependencies from the root of the frontend:
   ```bash
   pnpm install
   ```

2. Start the development server for all apps and packages:
   ```bash
   pnpm run dev
   ```

3. Build all apps and packages:
   ```bash
   pnpm run build
   ```

## Key Technologies
- **Next.js** (App Router)
- **React 19**
- **Tailwind CSS**
- **Framer Motion**
- **Turborepo**
- **React Query** (TanStack Query)

# Lumen Web (Student-Facing App)

`apps/web` is the primary student-facing application. It is a Next.js 16 project using the App Router, built with React 19 and Tailwind CSS v4.

## Overview

- Server-side rendering for SEO-sensitive public pages (home, marketing) and client-side rendering for the authenticated dashboard.
- Internationalized with `next-intl` (locales: English `en`, Vietnamese `vi`).
- Installable as a Progressive Web App (PWA) via `src/app/manifest.ts` - no service worker is bundled, so no large assets are cached.
- Theming via `next-themes` (light/dark) using CSS variables from `@lumen/uikit`.

## Authentication Flow (Passwordless)

The login page (`src/features/auth/pages/login.tsx`) supports only two methods:

1. Google: `@react-oauth/google` `useGoogleLogin` sends the access token to `POST /api/iam/google-login`.
2. Email OTP: the user enters an email, the app calls `POST /api/iam/email-otp/send`, then enters the 6-digit code and calls `POST /api/iam/login`. The account is created automatically on first verification.

On success, `useAuthStore` (Zustand) persists the user and the app redirects. There is no password, register, or forgot/reset-password screen.

## Feature Areas

- Dashboard: overview of learning progress, XP, streaks, and daily goals.
- Vocabulary Bank: spaced-repetition flashcards and word lists.
- Grammar Studio: structured topics, lessons, and interactive exercises.
- Reading: articles with one-click translation.
- TOEIC: mock tests with scoring and explanations.
- Dictation: audio dictation practice.
- Quiz: adaptive quizzes.
- Settings: profile and account management.

## Tech Stack

- Next.js 16 (App Router), React 19
- Tailwind CSS v4, `@lumen/uikit` (base-ui based design system)
- `next-intl` for i18n
- Framer Motion for animations
- TanStack Query for server state
- Zustand for client state (auth store)
- React Hook Form + Zod for forms/validation
- `@react-oauth/google` for Google login
- `sonner` for toasts, `recharts` for dashboards, `date-fns` for dates

## Project Structure

```
src/
  app/
    [locale]/
      (auth)/login/            # login page (email OTP + Google)
      (dashboard)/             # authenticated areas: overview, vocabulary, quiz, reading, toeic, dictation, settings, ...
      layout.tsx, page.tsx      # root locale layout + home
    manifest.ts                # PWA manifest
    globals.css
  features/                    # feature modules: home, auth, dashboard, vocabulary, quiz, reading, toeic, dictation, settings, ...
  services/                    # API service layer (auth, core), mapped via @lumen/shared-api
  shared/                      # constants (routes, api endpoints), i18n messages, types
  store/                       # Zustand stores (auth)
  middleware.ts                # locale negotiation + route protection
```

## Internationalization

Translation catalogs live in `src/shared/i18n/messages/{en,vi}.json`. The `Auth` namespace covers the login/OTP flow; `Index` covers the home page; `Settings` covers account settings.

## Getting Started

From the frontend workspace root:

```bash
pnpm install
pnpm --filter web dev         # or: cd apps/web && pnpm dev
```

The app reads the API base from environment configuration supplied by the web app (see `.env*` / `next.config`). It expects the backend running at the configured `BACKEND_URL`. By default it serves on the Next.js port (3000).

## Scripts (in `apps/web`)

- `pnpm dev` - Next.js dev server.
- `pnpm build` - production build.
- `pnpm start` - serve the production build.
- `pnpm lint` - ESLint.

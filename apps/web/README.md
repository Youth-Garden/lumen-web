# Lumen Web App

The main user-facing Next.js application for the Lumen learning platform.

## Features
- **Dashboard**: High-level overview of learning progress, XP points, and daily goals.
- **Grammar Studio**: Structured grammar topics, lessons, and interactive exercises.
- **Vocabulary Bank**: Spaced-repetition flashcards and word lists.
- **Listening & Speaking**: Audio dictation, speech recognition tasks, and AI assessments.
- **Authentication**: JWT-based secure authentication flow.

## Getting Started

To run the web app in isolation:

```bash
cd apps/web
pnpm run dev
```

The web app is configured to run on `http://localhost:3000` by default.

## Technology Stack
- Next.js (App Router)
- Tailwind CSS
- React Query
- next-intl (Internationalization)
- Framer Motion

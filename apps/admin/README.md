# Lumen Admin App

The internal administration dashboard for the Lumen platform.

## Features
- **User Management**: View and manage users, roles, and subscriptions.
- **Content Management**: Create, edit, and organize grammar topics, reading materials, vocabulary decks, and quizzes.
- **Analytics Overview**: High-level system statistics.

## Getting Started

To run the admin app in isolation:

```bash
cd apps/admin
pnpm run dev
```

The admin app is typically configured to run on a separate port from the main web app (e.g., `http://localhost:3001`).

## Technology Stack
- Next.js (App Router)
- Tailwind CSS
- React Query

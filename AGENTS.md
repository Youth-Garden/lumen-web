# Frontend Development Guidelines

## React Hooks Naming and Structure Convention

- **File Naming**: Do NOT use `mutations.ts` or `queries.ts`. Name hook files descriptively based on what they do (e.g., `use-vocabulary.ts`, `use-auth.ts`, `use-materials.ts`, `use-forgot-password.ts`).
- **Grouping**: Group short, related hooks together into one file (e.g. `use-materials.ts`). Separate long or unrelated hooks into their own distinct files (e.g. `use-forgot-password.ts`).
- **Hook Function Naming**: Do NOT append `Query` or `Mutation` to hook function names. Use clean names like `useCreateMaterial` or `useMaterials` instead of `useCreateMaterialMutation` or `useMaterialsQuery`.
- **Shared Utilities**: For generic, utility hooks (such as those from `usehooks.com`), do NOT install full NPM packages. Instead, copy only the specific hooks you need into `packages/uikit/src/hooks` so they can be shared across all applications.

## Frontend Components Convention

- **Data Transformation & Fallbacks**: Do NOT add default values, fallbacks (e.g. `|| ""`, `|| []`, `|| Date.now() + Math.random()`), or data transformations in the UI component layer (like inside `useEffect`). All data mapping, formatting, and fallback logic must be handled cleanly at the mapper/service layer or custom hooks.
- **TypeScript `any`**: Strictly avoid using `any` types in components when mapping data. Ensure proper typings are inferred or explicitly defined.

## Frontend Naming Convention

- **Descriptive Names**: Do NOT use single-letter variables or parameters (e.g., `q`, `m`, `n`). ALWAYS use descriptive variable names (e.g., `question`, `user`, `index`, `item`). This is strictly prohibited.

## Service & API Layer Convention

- **Mapper Registry**: ALL API endpoints MUST be explicitly registered in a `MapperRegistry` (`[feature].registry.ts`). No exceptions. Even if the endpoint only returns a simple `{ id: string }`, you must register it with `idResponseMapper`. Do not rely on the core API client implicitly returning unmapped JSON.

## State & Routing Convention

- **Route Parameters**: In Client Components, always use `useParams()` from `next/navigation` to read route parameters. Do NOT rely on the parent `page.tsx` passing parameters down through component props, as this creates messy boundaries between Server and Client components.

## UI & Architecture Convention

- **Internationalization (i18n)**: NEVER hardcode UI text strings in JSX. All text must be extracted to `en.json` and `vi.json` files and accessed via `useTranslations()` from `next-intl`.
- **i18n Fallbacks**: DO NOT use the `fallback` parameter in `useTranslations` or `t()` for static JSON strings (e.g., `t('key', { fallback: 'Text' })`). `fallback` is unnecessary for standard i18n keys and causes clutter. Always define the key in the JSON files directly.
- **Portal & Floating UI**: When creating Modals, Dialogs, or Popovers that appear over the main layout, utilize `@lumen/uikit/portal` (`usePortal` or `usePortalWithoutBackdrop`). Do not mount global overlays deeply inside the DOM tree.
- **Pages Directory and `app/` Routing (Strict)**:
  - Module-specific pages MUST be placed inside `features/[module]/pages/`.
  - The files in the Next.js `app/` directory (`page.tsx`) must be absolutely minimal. They should NOT contain UI layouts (e.g., `<div className="...">`), component imports (like `Icons`), state management, or React hooks.
  - They must ONLY import the fully assembled page component from `features/[module]/pages/` and export it directly (e.g. `export default SettingsPage;`). Do not wrap it in unnecessary functions like `export default function SettingsRoute() { return <SettingsPage />; }`.

## File & Component Naming Convention

- **Simplicity in Naming**: Keep component and function names as simple and concise as possible. Avoid redundant or overly complex prefixes like `Global` (e.g., use `NotFound` instead of `GlobalNotFound`, use `Error` instead of `GlobalError`).
- **Casing**: File names must be strictly `kebab-case.tsx` or `kebab-case.ts`. Component names and exported functions/interfaces must be strictly `PascalCase`.
- **Pages Naming**: Any file residing in a `features/[module]/pages/` directory must be suffixed with `-page.tsx` (e.g., `deck-list-page.tsx`). The exported React component inside must strictly be suffixed with `Page` (e.g., `export const DeckListPage = ...`). This ensures that the component name and filename are synchronized.

## DTO & Model Types Convention

- **Enums for Strict Values**: Do NOT use inline string literal unions (e.g. `type: 'VIDEO' | 'AUDIO' | 'TEXT'`) for strict data model fields or DTO properties. You MUST define and use TypeScript Enums (e.g. `export enum MaterialTypeEnum { ... }`) to ensure type safety and reusability across the application.
- **Nullable vs Optional Fields**: For DTO properties that might not be returned by the backend, DO NOT use strict `T | null` (e.g. `avatarUrl: string | null;`) which forces null checks and default values everywhere. Instead, use optional parameters `?` (e.g. `avatarUrl?: string;`). Only use strict null types if the backend explicitly guarantees returning a `null` key and the presence of the key is strictly required by the frontend layout. Avoid injecting `|| null` fallbacks in mappers unless explicitly necessary.

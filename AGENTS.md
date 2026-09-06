# Frontend Development Guidelines

## React Hooks Naming and Structure Convention

- **File Naming**: Do NOT use `mutations.ts` or `queries.ts`. Name hook files descriptively based on what they do (e.g., `use-vocabulary.ts`, `use-auth.ts`, `use-materials.ts`, `use-forgot-password.ts`).
- **Grouping**: Group short, related hooks together into one file (e.g. `use-materials.ts`). Separate long or unrelated hooks into their own distinct files (e.g. `use-forgot-password.ts`).
- **Hook Function Naming**: Do NOT append `Query` or `Mutation` to hook function names. Use clean names like `useCreateMaterial` or `useMaterials` instead of `useCreateMaterialMutation` or `useMaterialsQuery`.
- **Shared Utilities**: For generic, utility hooks (such as those from `usehooks.com`), do NOT install full NPM packages. Instead, copy only the specific hooks you need into `packages/uikit/src/hooks` so they can be shared across all applications.

## Frontend Components Convention

- **Data Transformation & Fallbacks**: Do NOT add default values, fallbacks (e.g. `|| ""`, `|| []`, `|| Date.now() + Math.random()`), or data transformations in the UI component layer (like inside `useEffect`). All data mapping, formatting, and fallback logic must be handled cleanly at the mapper/service layer or custom hooks.
- **Direct Domain / Service Types Reuse**: Strictly avoid defining redundant ad-hoc interfaces or adapter types when existing DTOs/Domain types from `@/services` already solve the problem. Fewer types is better; never create an intermediate type unless genuinely necessary for isolated UI state.
- **No In-Component Data Restructuring**: Do NOT reshape or map data inside UI components (e.g. `useMemo(() => data.map(...))` to rename fields or repackage objects for subcomponents). Pass and consume shared types directly. Transformations belong strictly in mappers (`[feature].mappers.ts`).
- **TypeScript `any`**: Strictly avoid using `any` types in components when mapping data. Ensure proper typings are inferred or explicitly defined.
- **No Nested Button in Link**: NEVER nest `<Button>` inside Next.js `<Link>` or vice-versa. Style `<Link>` directly or use `asChild` to avoid invalid HTML, hydration issues, and lingering click focus rings.
- **Strict UIKit Component & Icon Reuse**: ALWAYS use components from `@lumen/uikit/components` instead of creating ad-hoc UI duplicates. All SVGs and icons must be imported from `@lumen/uikit/icons` (via `Icons` or custom icons registered in UIKit). Never define raw SVG components inside `features/` or `app/`.
- **Component Line Count Limit**: Module-specific components (inside `features/[module]/components/`) and page files (inside `features/[module]/pages/`) MUST NOT exceed **300 lines**. If a file grows beyond 300 lines, it MUST be refactored by either: (1) extracting sub-components into separate files, or (2) extracting complex logic into a custom hook. This rule does NOT apply to highly reusable library components in `packages/uikit/src/` or shared utility files, where a higher line count may be justified.
- **Component Sub-folder Organization**: Inside `features/[module]/components/`, related components MUST be grouped into dedicated sub-folders according to their feature context or domain (for example: `components/study/` for study-related components like `study-view.tsx`, `study-flashcard.tsx`, `study-completed.tsx`, `flashcard-review.tsx`, `folder-selection-view.tsx`, `study-settings-dialog.tsx`; `components/badges/` for badges and achievements; etc.). Avoid dumping all module components into a single flat `components/` directory.

## Frontend Naming Convention

- **Descriptive Names**: Do NOT use single-letter variables or parameters (e.g., `q`, `m`, `n`). ALWAYS use descriptive variable names (e.g., `question`, `user`, `index`, `item`). This is strictly prohibited.

## Service & API Layer Convention

- **Mapper Registry**: ALL API endpoints MUST be explicitly registered in a `MapperRegistry` (`[feature].registry.ts`). No exceptions. Even if the endpoint only returns a simple `{ id: string }`, you must register it with `idResponseMapper`. For endpoints returning `void` or 204 No Content, explicitly register them using `voidResponseMapper` (or `noContentMapper`) from `@/services/core`. NEVER assign `undefined` to an endpoint key in a `MapperRegistry`. Do not rely on the core API client implicitly returning unmapped JSON.
- **Raw Data in Mappers**: In mapper files (`[feature].mappers.ts`), raw data received from the backend MUST simply be typed as `any` (e.g. `(raw?: any)`). Strictly DO NOT define intermediate `Raw...` interfaces or types (e.g. `RawWord`, `RawDeck`, `RawExample`). The mapper's sole responsibility is taking `raw: any` and mapping it directly into the clean, strongly-typed Frontend models.

## State & Routing Convention

- **Route Parameters**: In Client Components, always use `useParams()` from `next/navigation` to read route parameters. Do NOT rely on the parent `page.tsx` passing parameters down through component props, as this creates messy boundaries between Server and Client components.
- **Navigation via RouteEnum**: ALL programmatic navigation MUST use `RouteEnum` from `@/shared/constants`. NEVER push raw URL strings (e.g., `router.push('/vocabulary/folders/123')`). For routes that include dynamic segments (`:id`), MUST use `formatUrl` from `@lumen/shared-api` (e.g., `router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: folder.id }))`). Hardcoding URL strings bypasses the single source of truth for routes and causes silent breakage during route refactors.

## UI & Architecture Convention

- **Card Component Variants**: The `Card` component now supports two background variants: `variant="default"` (white background) and `variant="muted"` (muted background). Use `default` as standard. If a card is placed inside another card, the inner card will automatically apply the muted background through CSS; however, when placed in other contexts that require a muted background, explicitly set `variant="muted"`.
- **Internationalization (i18n)**: NEVER hardcode UI text strings in JSX. All text must be extracted to `en.json` and `vi.json` files and accessed via `useTranslations()` from `next-intl`.
- **Translation Keys**: All keys in JSON translation files (`en.json`, `vi.json`) MUST strictly use `camelCase`. Do NOT use `PascalCase`, `snake_case`, or `SCREAMING_SNAKE_CASE` (e.g., use `listeningDetail` instead of `LISTENING_DETAIL`). When rendering Enum values via i18n, map the enum value to a `camelCase` key.
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

- **Enums for Strict Values**: Do NOT use inline string or numeric literal unions (e.g. `type: 'VIDEO' | 'AUDIO' | 'TEXT'` or `quality: 1 | 2 | 3 | 4`) for strict data model fields, function arguments, or DTO properties. You MUST define and use TypeScript Enums (e.g. `export enum MaterialTypeEnum { ... }` or `export enum FlashcardRating { ... }`) to ensure type safety and reusability across the application.
- **No Magic Numbers**: Avoid hardcoding magic numbers or strings directly into components. Always define them as Enums or constants.
- **Nullable vs Optional Fields**: For DTO properties that might not be returned by the backend, DO NOT use strict `T | null` (e.g. `avatarUrl: string | null;`) which forces null checks and default values everywhere. Instead, use optional parameters `?` (e.g. `avatarUrl?: string;`). Only use strict null types if the backend explicitly guarantees returning a `null` key and the presence of the key is strictly required by the frontend layout. Avoid injecting `|| null` fallbacks in mappers unless explicitly necessary.

## Code Commenting Convention

- **No Unnecessary Comments**: Do not add comments for normal, self-explanatory information or clearly written code. Only add comments if a function is multi-step, contains complex logic, or is highly complicated.

## Strict Prohibition on Workarounds and Aliases (MANDATORY)

- **NEVER use temporary workarounds, re-export aliases, or type shims**: Do NOT create bridge aliases like `export const useCreateDeck = useCreateFolder;`, `export type Deck = Folder;`, `export const listDecks = listFolders;`, etc.
- **Complete Refactoring**: When renaming or removing a concept, you MUST refactor 100% of its usages cleanly across all files, components, types, hooks, services, and route definitions.
- **Zero Compatibility Shims**: Do not leave legacy variable names, prop names, or function wrappers behind to avoid updating caller code.


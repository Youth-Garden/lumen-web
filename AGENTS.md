# Frontend Development Guidelines

## 1. Naming Conventions

### 1.1 File & Component Naming

- **Casing**: File names MUST strictly use `kebab-case.tsx` / `kebab-case.ts`. Component names, exported functions, and interfaces MUST strictly use `PascalCase`.
- **Simplicity in Naming**: Keep component and function names as simple and concise as possible. Avoid redundant or overly generic prefixes such as `Global` (e.g. use `NotFound` instead of `GlobalNotFound`, `Error` instead of `GlobalError`).
- **Pages Naming**: Any file inside a `features/[module]/pages/` directory MUST be suffixed with `-page.tsx` (e.g. `deck-list-page.tsx`), and the exported React component MUST be suffixed with `Page` (e.g. `export const DeckListPage = ...`). The filename and component name must stay in sync.
- **Descriptive Variable Names**: Never use single-letter variables or parameters (e.g. `q`, `m`, `n`). Always use descriptive names (e.g. `question`, `user`, `index`, `item`). This is strictly enforced with no exceptions.

### 1.2 React Hooks Naming & File Structure

- **File Naming**: Do NOT name hook files `mutations.ts` or `queries.ts`. Name hook files descriptively based on what they do (e.g. `use-vocabulary.ts`, `use-auth.ts`, `use-materials.ts`, `use-forgot-password.ts`).
- **Grouping**: Group small, related hooks together in a single file (e.g. `use-materials.ts`). Split large or unrelated hooks into their own dedicated files (e.g. `use-forgot-password.ts`).
- **Hook Function Naming**: Do NOT suffix hook function names with `Query` or `Mutation`. Use clean names such as `useCreateMaterial` or `useMaterials` instead of `useCreateMaterialMutation` or `useMaterialsQuery`.

---

## 2. Project & Directory Structure

### 2.1 Strict Separation of Concerns by Directory (MANDATORY)

- **`components/`**: MUST contain React UI components (`.tsx`) ONLY. Never place non-component files (constants, animation variants, configs, utils, types) inside `components/`. When supporting files are needed, create the appropriate dedicated folder instead (`constants/`, `hooks/`, `types/`, `utils/`).
- **`constants/`**: Holds constants, static configs, and animation variants (e.g. `animations.ts`).
- **`hooks/`**: Holds React custom hooks (`use-[name].ts`).
- **`types/`**: Holds domain types, feature models, and shared interfaces (`[feature].types.ts`).

### 2.2 Re-export Convention via `index.ts`

- **Hooks & Constants**: MUST be re-exported centrally through an `index.ts` file in their own directory (e.g. `features/[module]/hooks/index.ts`, `features/[module]/constants/index.ts`) so other modules can import them cleanly and consistently.
- **Components**: Do NOT re-export components through `index.ts`. Components must be imported directly from their specific file to avoid large barrel files and to preserve tree-shaking and code-splitting.

### 2.3 Type Placement Convention

- **Hook-specific Props/Return types**: Types that exist only to serve a hook's parameters or return value (`Use[Name]Props`, `Use[Name]Return`) should be defined directly inside that hook's file (or in a `use-[name].types.ts` file if it grows too large).
- **Domain / Entity / Shared Types**: Types that represent data, business models, stats, or data structures (e.g. `MissedWordStat`, `StudyFeedbackState`, `StudyQueueItem`) must NEVER live inside `hooks/`. They MUST be placed in the module's `types/` directory (e.g. `features/[module]/types/[module].types.ts`).

### 2.4 Pages Directory & `app/` Routing (Strict)

- Module-specific pages MUST live inside `features/[module]/pages/`.
- Files in the Next.js `app/` directory (`page.tsx`) must be absolutely minimal. They must NOT contain UI layout markup (e.g. `<div className="...">`), component imports (like `Icons`), state management, or React hooks.
- They must ONLY import the fully assembled page component from `features/[module]/pages/` and export it directly (e.g. `export default SettingsPage;`). Do not wrap it in an unnecessary intermediate function like `export default function SettingsRoute() { return <SettingsPage />; }`.

---

## 3. Component Rules

### 3.1 Data Handling in Components

- **No Fallbacks or Data Transformation in the UI Layer**: Do NOT add default values or fallbacks (e.g. `|| ""`, `|| []`, `|| Date.now() + Math.random()`), or perform data transformations, inside UI components (including inside `useEffect`). All data mapping, formatting, and fallback logic must live in the mapper/service layer or in custom hooks.
- **No In-Component Data Restructuring**: Do NOT reshape or remap data inside UI components (e.g. `useMemo(() => data.map(...))` to rename fields or repackage objects for subcomponents). Pass and consume shared types directly. All transformations belong strictly in mapper files (`[feature].mappers.ts`).
- **Reuse Domain/Service Types Directly**: Strictly avoid defining redundant ad-hoc interfaces or adapter types when an existing DTO/domain type from `@/services` already solves the problem. Fewer types is better — never create an intermediate type unless it is genuinely required for isolated UI state.
- **No `any` in Components**: Strictly avoid `any` types in components when mapping or consuming data. Ensure proper types are inferred or explicitly defined.

### 3.2 Component Size & Organization

- **Line Count Limit**: Module-specific components (`features/[module]/components/`) and page files (`features/[module]/pages/`) MUST NOT exceed **300 lines**. If a file grows beyond 300 lines, refactor it by either (1) extracting sub-components into separate files, or (2) extracting complex logic into a custom hook. This limit does not apply to highly reusable library components in `packages/uikit/src/` or to shared utility files, where a higher line count may be justified.
- **Sub-folder Organization**: Inside `features/[module]/components/`, related components MUST be grouped into dedicated sub-folders based on feature/domain context (e.g. `components/study/` for study-related components like `study-view.tsx`, `study-flashcard.tsx`, `study-completed.tsx`, `flashcard-review.tsx`, `folder-selection-view.tsx`, `study-settings-dialog.tsx`; `components/badges/` for badges and achievements). Never dump all module components into a single flat `components/` directory.

### 3.3 Design System & UIKit Usage

- **Strict UIKit Component & Icon Reuse**: ALWAYS use components from `@lumen/uikit/components` instead of creating ad-hoc duplicate UI. All SVGs and icons must be imported from `@lumen/uikit/icons` (via `Icons` or icons registered in UIKit). Never define raw SVG components inside `features/` or `app/`.
- **No Manual Button Re-styling — Prioritize Variants**: Do NOT re-style or manually override the `<Button>` component's styles (e.g. arbitrarily overriding `border`, `rounded`, `bg`, `shadow`, or padding). The system's `Button` component already provides a full set of `variant`s (`default`, `secondary`, `outline`, `ghost`, `subtle`, `destructive`) and `size`s (`default`, `sm`, `lg`, `icon`, `icon-sm`). You MUST use the existing `variant` and `size` props directly — never inject override classes that break the design system.
- **No Nested Button in Link**: NEVER nest `<Button>` inside a Next.js `<Link>` or vice versa. Style `<Link>` directly, or use `asChild`, to avoid invalid HTML, hydration issues, and lingering click focus rings.
- **Card Component Variants**: The `Card` component supports two background variants: `variant="default"` (white background) and `variant="muted"` (muted background). Use `default` as the standard. When a card is nested inside another card, the inner card automatically applies the muted background via CSS; in other contexts that require a muted background, set `variant="muted"` explicitly.

### 3.4 Anti-Border / Anti-Card-Clutter Aesthetics (MANDATORY)

- **Minimize Border Usage**: Do NOT overuse hard borders (`border`, `border border-border/80`, `border-border/50`). Lumen's design language is flat, airy, subtle, and modern.
- **Avoid Card/Background Overuse (Anti-Card-Clutter / Anti-Box-in-Box)**: Do NOT wrap individual rows, paragraphs, or list items in separate background boxes (`bg-muted/20`, `bg-muted/30`, `rounded-2xl border...`). Strictly avoid "box-in-box" nesting, which creates a cramped, cluttered interface. Instead, use the Dialog's/Page's native background surface combined with natural spacing (padding/gap) and clear typography hierarchy.

---

## 4. Internationalization (i18n)

- **No Hardcoded Text**: NEVER hardcode UI text strings in JSX. All text must be extracted into `en.json` and `vi.json` and accessed via `useTranslations()` from `next-intl`.
- **Translation Key Casing**: All keys in translation JSON files (`en.json`, `vi.json`) MUST strictly use `camelCase`. Do NOT use `PascalCase`, `snake_case`, or `SCREAMING_SNAKE_CASE` (e.g. use `listeningDetail`, not `LISTENING_DETAIL`). When rendering an Enum value via i18n, map the enum value to a `camelCase` key.
- **No i18n Fallbacks**: Do NOT use the `fallback` parameter in `useTranslations` or `t()` for static JSON strings (e.g. `t('key', { fallback: 'Text' })`). A fallback is unnecessary for standard i18n keys and only adds clutter — always define the key directly in the JSON files.
- **No Ad-hoc Dictionaries**: Never write a custom dictionary object or build a homemade translation function inside a service or utility file. All display text MUST be centralized in `messages/{locale}.json` and rendered through `useTranslations` from `next-intl` in the UI layer only.

---

## 5. Routing & Navigation

- **Route Parameters**: In Client Components, always read route parameters using `useParams()` from `next/navigation`. Do NOT rely on the parent `page.tsx` passing parameters down through component props, since this creates a messy boundary between Server and Client components.
- **Navigation via `RouteEnum`**: ALL programmatic navigation MUST use `RouteEnum` from `@/shared/constants`. NEVER push raw URL strings (e.g. `router.push('/vocabulary/folders/123')`). For routes containing dynamic segments (`:id`), use `formatUrl` from `@lumen/shared-api` (e.g. `router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: folder.id }))`). Hardcoded URL strings bypass the single source of truth for routes and cause silent breakage during route refactors.
- **Portal & Floating UI**: When building Modals, Dialogs, or Popovers that render over the main layout, use `@lumen/uikit/portal` (`usePortal` or `usePortalWithoutBackdrop`). Never mount global overlays deep inside the DOM tree.

---

## 6. Service & API Layer

- **Mapper Registry Required**: ALL API endpoints MUST be explicitly registered in a `MapperRegistry` (`[feature].registry.ts`), with no exceptions. Even an endpoint that only returns `{ id: string }` must be registered with `idResponseMapper`. Endpoints returning `void` or `204 No Content` must be explicitly registered with `voidResponseMapper` (or `noContentMapper`) from `@/services/core`. NEVER leave an endpoint key unassigned (`undefined`) in a `MapperRegistry`, and never rely on the core API client implicitly returning unmapped JSON.
- **Raw Data Typing in Mappers**: In mapper files (`[feature].mappers.ts`), raw backend data MUST be typed simply as `any` (e.g. `(raw?: any)`). Strictly do NOT define intermediate `Raw...` interfaces or types (e.g. `RawWord`, `RawDeck`, `RawExample`). A mapper's sole responsibility is to take `raw: any` and map it directly into the clean, strongly-typed frontend model.
- **Strict Domain Separation Across Services**: Service modules in `services/` MUST be strictly separated along business domain boundaries — never merge multiple domains into a single service. For example, the `vocabulary` domain (word management, folder lists, flashcard CRUD) MUST be fully separated from the `study` domain (due flashcards, review submission, study sessions). `study` APIs or hooks must never leak into `services/vocabulary` or `features/vocabulary/hooks`. Every API endpoint, service class, query key, mapper registry, type, and hook related to studying/reviewing must live in `services/study` and `features/study/hooks`.
- **Clean Service Import Convention (MANDATORY)**: When importing types, models, keys, or functions from a domain service, ALWAYS import directly from that domain's root module (e.g. `import { VocabularyWord, Folder } from '@/services/vocabulary';`, `import { User } from '@/services/auth';`, `import { DueFlashcard } from '@/services/study';`). NEVER import deep internal files such as `@/services/vocabulary/vocabulary.types`, `@/services/study/study.types`, `@/services/auth/auth.types`, or `@/services/progress/progress.types`. Every service module MUST re-export all of its types, keys, and service functions through that domain's `index.ts`.

---

## 7. DTO & Model Types (Strict)

- **Enums for Strict Values**: Do NOT use inline string or numeric literal unions (e.g. `type: 'VIDEO' | 'AUDIO' | 'TEXT'` or `quality: 1 | 2 | 3 | 4`) for strict data model fields, function arguments, or DTO properties. You MUST define and use TypeScript Enums (e.g. `export enum MaterialTypeEnum { ... }`, `export enum FlashcardRating { ... }`) to guarantee type safety and reusability across the app.
- **No Magic Numbers / Magic Strings**: Never hardcode magic numbers, magic strings, or key codes directly in code, components, or hooks. All fixed values, configuration, and keyboard shortcuts MUST be defined via a semantically clear Enum or Constant. For example, study keyboard shortcuts must be defined as an Enum whose key name expresses the action and whose value is the key (e.g. `export enum StudyShortcutKey { FLIP_SPACE = 'Space', MASTERED = '1', REVIEW = '3', ... }`) — never compare directly like `event.key === '1'`.
- **Strict Type Certainty (No Careless `?` / `| null`)**: Minimize the use of optional (`?`) or `| null` modifiers in interfaces/types. Scattering `?` or `| null` everywhere signals uncertainty and a poor understanding of the data schema/contract. You MUST know precisely which fields are required and which are guaranteed to always have a value (e.g. if a mapper always initializes an empty array `[]`, the type MUST be `T[]`, never `T[]?` or `T[] | null`). Only use `?` when a field is genuinely optional. Only use `| null` when the backend explicitly and intentionally guarantees a `null` value as part of its business logic. Never carelessly combine both, e.g. `?: string | null`.

---

## 8. Code Commenting (Strict)

- **No Redundant or Self-Evident Comments**: It is forbidden to write comments that explain obvious, self-explanatory code (e.g. describing variable/function names, describing a routine step, describing props, imports, JSX returns, or motion variants). Clean, explicit code is the best documentation.
- Comments are ONLY allowed at genuinely important points: complex algorithms, unusual edge cases, workarounds for third-party bugs, or an especially hard-to-follow function/logic block.
- If a piece of code is not "genuinely complex," do NOT add any comment to it at all.
- All comments (when used) MUST be written in concise, clear English.

---

## 9. Zero-Workaround & Zero-Anti-Pattern Policy (MANDATORY)

**Absolutely no workaround or anti-pattern of any kind is permitted.** Unless the user explicitly and directly requests it in the current prompt, no workaround or anti-pattern may be used under any circumstances. Never take a shortcut, a temporary patch/quick fix, or bypass a technical limitation with an anti-architectural measure. Every solution must follow Clean Architecture, Single Source of Truth, and Separation of Concerns from the outset.

The following anti-patterns/workarounds are strictly forbidden:

1. **Service Layer Leaking into UI (Mixing Presentation & Data Layers)**: The HTTP Client / Service layer (`CoreService`, API services) must NEVER import UI components, fire `toast` notifications, parse cookies/DOM/URL to infer UI context, or navigate via `window.location`. The Service layer may only interact with HTTP, mappers, and domain state (Zustand store / events).
2. **Duplicate Dictionaries / Ad-hoc i18n**: Never write a custom dictionary object or a homemade translation function inside a service/util. All display text MUST be centralized in `messages/{locale}.json` and rendered via `next-intl`'s `useTranslations` in the UI layer.
3. **Workarounds & Compatibility Aliases**: Never create bridge aliases (e.g. `export const useCreateDeck = useCreateFolder;`, `export type Deck = Folder;`) to avoid a proper refactor. Refactors must be carried out completely.
4. **Coupled / Ping-Pong State Hooks**: Never split a single business state flow across multiple hooks that depend on each other circularly (hook A calls hook B, hook B fires a callback back to hook A). State must be consolidated into a single source of truth and manipulated via pure functions.
5. **Careless Type Bypasses**: Never use `any` or `as unknown as T` to bypass the TypeScript compiler.

---

## 10. Content & Copywriting Neutrality (Strict)

- **No Hardcoded Specialized Content in Generic UI**: NEVER inject or hardcode specialized domain terms (such as "TOEIC," "IELTS," specific certifications, or specific exam names) into general application copy, section titles, headers, badges, or input placeholders (e.g. use "System Folders" instead of "System Folders (TOEIC & Curated)", "e.g. Daily Vocabulary" instead of "e.g. TOEIC Vocabulary").
- **Generic & Reusable Content**: Keep general platform features (vocabulary, flashcards, decks/folders, dashboard, settings) neutral, generic, and versatile. Specialized domain terms may ONLY appear inside modules explicitly and specifically designed for that purpose (e.g. an actual dedicated TOEIC exam-simulation player).
- **No Redundant Count Badges in Headers**: NEVER append count numbers or pill badges (e.g. `(0)`, `[count]`, `<span ...>{items.length}</span>`) next to section titles, headings, or category labels unless explicitly requested by the user. Keep section headings clean, focused, and free of clutter.

---

## 11. Hook Length Limit & Loose Coupling (MANDATORY)

- **Custom Hook Length Limit**: A React custom hook MUST NOT exceed **300 lines of code**.
- **Anti-Coupled Hooks / Anti-Ping-Pong State**: When splitting logic to satisfy the line limit, NEVER split a single business state flow into multiple custom hooks that depend on each other circularly (hook A depends on hook B, hook B calls back into hook A's state/callbacks, passing callbacks like `onAction` or `resetAction` back and forth). Instead, you MUST follow:
  1. **Pure Utilities First**: Prioritize extracting computation and data-transformation logic (data transformations, algorithms, queue calculation, rating mapping) into pure functions inside `utils/`. Pure functions have no React lifecycle/state, are far easier to test, and don't create coupling between hooks.
  2. **Single Source of Truth**: The core state of a process (session queue, feedback, current card) must be managed centrally in exactly one place.
  3. **Independent, Unidirectional Sub-hooks**: If sub-hooks are created (e.g. an audio player, a keyboard-shortcut listener), they must be fully independent, receiving only the input they need (unidirectional data flow), and must never interfere with or depend on another hook's state.

---

## 12. Testing & Verification Policy (MANDATORY)

- **No Browser Automation for Testing**: NEVER open a browser (no `browser_subagent`, Puppeteer, or any browser automation) to verify UI or functionality. Pages/features requiring user login cannot be accessed by an agent anyway.
- All correctness checks MUST be done by reading and understanding the code, analyzing logic, and running `tsc --noEmit`, `eslint`, or tests directly in the terminal. Never open a browser to test.

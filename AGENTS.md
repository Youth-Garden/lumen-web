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

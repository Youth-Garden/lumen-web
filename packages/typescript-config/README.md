# @lumen/typescript-config

Shared TypeScript configuration (`tsconfig.json`) for the Lumen monorepo.

This package provides a strict base configuration to ensure type safety and consistent compilation settings across Next.js apps and internal packages.

## Usage

In your project's `tsconfig.json`:

```json
{
  "extends": "@lumen/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

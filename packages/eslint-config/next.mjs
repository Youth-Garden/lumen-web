import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

export const nextConfig = [
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**"
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];

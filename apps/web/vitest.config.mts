import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.spec.{ts,tsx}',
      '../../packages/*/src/**/*.spec.{ts,tsx}',
    ],
  },
  resolve: {
    tsconfigPaths: true,
  },
});

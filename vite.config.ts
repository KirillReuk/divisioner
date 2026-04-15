import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/divisioner/' : '/',
  plugins: [react()],
  test: {
    // Explicit `import { describe, it, expect } from 'vitest'` in tests avoids
    // narrowing tsconfig `types` (which would drop @types/react, etc.).
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/**/*.test.{ts,tsx}',
      ],
    },
  },
}))

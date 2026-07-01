import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: { DATABASE_URL: 'postgresql://test:test@localhost:5433/yoga_test' },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist', '**/*.dto.ts', '**/*.schema.ts'],
    },
    setupFiles: ['./src/tests/setup.ts'],
    sequence: { concurrent: false },
    pool: 'forks',
    fileParallelism: false,
  },
});

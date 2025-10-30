import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./tests/setup.js'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
});

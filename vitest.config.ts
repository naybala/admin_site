
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@components': resolve(__dirname, 'src/components'),
      '@customTypes': resolve(__dirname, 'src/types'),
      '@stores': resolve(__dirname, 'src/stores'),
    },
  },
});

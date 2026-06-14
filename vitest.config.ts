import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    setupFiles: ['./src/test/setup.ts'],
  },
})

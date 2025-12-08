import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/memorySequence/',
  plugins: [vue()],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'docs',
  },
})

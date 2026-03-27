import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Book-of-DSA/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    }
  }
})

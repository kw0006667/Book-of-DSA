import { defineConfig } from 'vite'

export default defineConfig({
  base: '/BookOfDSA/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    }
  }
})

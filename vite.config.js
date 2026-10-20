import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path for GitHub Pages subfolder
  build: {
    outDir: 'docs', // Builds directly into docs/ for instant GitHub Pages deployment
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        light: resolve(__dirname, 'light.html'),
      },
    },
  },
})

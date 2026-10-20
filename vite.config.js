import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path for GitHub Pages subfolder
  build: {
    outDir: 'docs', // Builds directly into docs/ for instant GitHub Pages deployment
  },
})

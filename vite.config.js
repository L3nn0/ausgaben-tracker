import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path so it runs smoothly on GitHub Pages (e.g. https://<user>.github.io/<repo>/)
})

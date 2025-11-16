import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/word-to-csv/web-app/', // GitHub Pages base path - update if repo name differs
})

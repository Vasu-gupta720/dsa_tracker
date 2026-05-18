import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/dsa_tracker/',
  plugins: [react()],
})

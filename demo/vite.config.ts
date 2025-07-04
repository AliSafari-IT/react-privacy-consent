import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@asafarim/react-privacy-consent': path.resolve(__dirname, '../src')
    }
  },
  server: {
    port: 3005
  }
})

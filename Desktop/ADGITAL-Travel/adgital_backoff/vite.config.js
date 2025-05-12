import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/react-pro-sidebar/], // Make sure to include this library if it has issues with module resolution
    },
  },
})

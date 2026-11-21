import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            {
              name: 'vendor-router',
              test: /[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run[\\/]router)[\\/]/,
            },
            {
              name: 'vendor-query',
              test: /[\\/]node_modules[\\/]@tanstack[\\/](react-query|query-core)[\\/]/,
            },
            {
              name: 'vendor-utils',
              test: /[\\/]node_modules[\\/](clsx|tailwind-merge)[\\/]/,
            },
            {
              name: 'vendor-recharts',
              test: /[\\/]node_modules[\\/](recharts|victory-vendor|d3-[^\\/]+)[\\/]/,
            },
            {
              name: 'vendor-gsap-lenis',
              test: /[\\/]node_modules[\\/](gsap|lenis)[\\/]/,
            },
            {
              name: 'vendor-supabase',
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            },
            {
              name: 'vendor-icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            },
          ],
        },
      },
    },
  },
})

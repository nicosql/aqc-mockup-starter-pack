import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8098'

  return {
    base: '/',
    plugins: [
      react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
      tailwindcss()
    ],
    build: {
      outDir: './dist',
      emptyOutDir: true,
      assetsDir: '_assets',
      rollupOptions: {
        output: {
          manualChunks: {
            data: [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table'
            ],

            forms: [
              'react-hook-form',
              '@hookform/resolvers',
              'zod',
              'date-fns',
              'react-day-picker'
            ],

            ui: [
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-icons',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              'class-variance-authority',
              'clsx',
              'next-themes',
              'lucide-react',
              'cmdk',
              'vaul',
              'sonner'
            ]
          }
        }
      }
    },
    publicDir: './public',
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true
        },
        '/quickbooks': {
          target: backendUrl,
          changeOrigin: true
        },
        '/auth/google': {
          target: backendUrl,
          changeOrigin: true
        },
        '/auth/github': {
          target: backendUrl,
          changeOrigin: true
        },
        '/auth/magic-link': {
          target: backendUrl,
          changeOrigin: true
        },
        '/auth/forgot-password': {
          target: backendUrl,
          changeOrigin: true
        },
        '/auth/verify-email-change': {
          target: backendUrl,
          changeOrigin: true
        },
        '/auth/logout': {
          target: backendUrl,
          changeOrigin: true
        },
        '/webhooks': {
          target: backendUrl,
          changeOrigin: true
        }
      }
    }
  }
})

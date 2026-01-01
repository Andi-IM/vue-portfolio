import { fileURLToPath, URL } from 'node:url'
import { codecovVitePlugin } from '@codecov/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

import istanbul from 'vite-plugin-istanbul'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test/', 'e2e/', 'src/services/**'],
        extension: ['.ts', '.vue'],
        requireEnv: true,
      }),
      codecovVitePlugin({
        enableBundleAnalysis: env.CODECOV_TOKEN !== undefined,
        bundleName: 'deretsolver',
        uploadToken: env.CODECOV_TOKEN,
        gitService: 'github',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          // Separate Vue vendor chunk for better caching
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
          },
        },
      },
    },
  }
})

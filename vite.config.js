import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

const { VITE_APP_BASE_URL } = loadEnv('', process.cwd());

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          APP_BASE_URL: VITE_APP_BASE_URL ? VITE_APP_BASE_URL : '/',
          APP_BASE_IMG: VITE_APP_BASE_URL
            ? `${VITE_APP_BASE_URL}/img/preview.png`
            : '/img/preview.png'
        }
      }
    }),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        sourcemap: true
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'FTP Client',
        short_name: 'FTP Client',
        description: 'FTP Client - Web application of the file transfer protocol',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./client', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  build: {
    outDir: 'dist/client'
  },
  preview: {
    port: 80,
    host: true,
    cors: true,
    open: false,
    strictPort: true
  }
});

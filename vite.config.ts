import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Vite's static server answers Range requests but omits Accept-Ranges on full responses,
// so PDF viewers fall back to downloading the whole file. Advertise range support explicitly.
const acceptRanges: Connect.NextHandleFunction = (req, res, next) => {
  const { url } = req as { url?: string };
  if (url?.split('?')[0]?.endsWith('.pdf')) res.setHeader('Accept-Ranges', 'bytes');
  next();
};

const pdfRangeRequests = (): Plugin => ({
  name: 'pdf-range-requests',
  configureServer: (server) => { server.middlewares.use(acceptRanges); },
  configurePreviewServer: (server) => { server.middlewares.use(acceptRanges); },
});

export default defineConfig({
  // GitHub Pages serves the app from /<repo>/; set BASE when building for it.
  base: process.env.BASE ?? '/',
  plugins: [
    react(),
    pdfRangeRequests(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon-64.png'],
      manifest: {
        name: 'מטבח חוץ – תכנית עבודה',
        short_name: 'מטבח חוץ',
        description: 'מודל תלת-ממדי, שלבי בנייה, רשימת חיתוך ורשימת קניות למטבח החוץ',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        orientation: 'any',
        start_url: '.',
        scope: '.',
        theme_color: '#0f766e',
        background_color: '#f5f7f4',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Everything the app needs offline, including the 3D view; the large PDF is cached only once opened.
        globPatterns: ['**/*.{js,css,html,png,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          { urlPattern: ({ url }) => url.pathname.endsWith('.pdf'), handler: 'CacheFirst', options: { cacheName: 'plan-pdf', rangeRequests: true } },
        ],
      },
    }),
  ],
  server: {
    host: true,
    allowedHosts: true,
    strictPort: false,
  },
});

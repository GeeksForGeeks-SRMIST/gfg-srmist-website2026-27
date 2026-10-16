import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // If you deploy to a sub-folder (e.g. GitHub Pages /gfg-club/), set base: '/gfg-club/'
  base: '/',
  build: { assetsDir: 'static' },
});

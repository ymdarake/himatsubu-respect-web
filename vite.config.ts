import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages (project pages) での配信ではリポジトリ名をベースにする
  // ローカル開発や他環境では '/'
  base: process.env.GITHUB_ACTIONS ? '/himatsubu-respect-web/' : '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});

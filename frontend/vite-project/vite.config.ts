import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'; // ← これが必要

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin()
  ],
  build: {
    target: 'es2015'
  }
});
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Meat-Mesh/' : '/',
  server: {
    port: 8080,
  },
  build: {
    outDir: 'dist',
  },
});

import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        paths: [path.resolve(__dirname, 'src')],
      },
    },
  },
  plugins: [],
});

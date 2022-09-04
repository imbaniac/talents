import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
});

import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';
import preact from '@preact/preset-vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    preact(),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
    svgr(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          gzipSize: true,
          brotliSize: true,
          emitFile: true,
          file: 'stats.html',
        }),
      ],
    },
  },
});

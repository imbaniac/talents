import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';
import preact from '@preact/preset-vite';
import svgr from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression';

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
    viteCompression({
      algorithm: 'brotliCompress',
    }),
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
  server: {
    proxy: {
      '/subgraphs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },

      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});

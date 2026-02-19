import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css';
import viteCompression from 'vite-plugin-compression';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactScopedCssPlugin(),
    tsconfigPaths(),
    viteCompression(),
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'vite.config.ts',
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.stories.*',
        'node_modules'
      ],
      outDir: 'dist/src',
      insertTypesEntry: true
    }),
    cssInjectedByJsPlugin()
  ],
  server: {
    port: 4205
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       // includePaths: [
  //       //   "src/styles"
  //       // ]
  //     }
  //   }
  // },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'react-filter',
      // the proper extensions will be added
      fileName: 'react-filter',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@emotion/react', '@emotion/styled', '@mui/material', 'react', 'react-dom'],
      // output: {
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     vue: 'Vue',
      //   },
      // },
    },
  },
  resolve: {
    //   dedupe: ['react', 'react-dom'],
    alias: {
      '@src': path.resolve(__dirname, 'src'), // Optional alias for cleaner imports
    }
  },
})

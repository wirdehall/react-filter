import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
  ],
  server: {
    port: 4205
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'react-filter',
      // the proper extensions will be added
      fileName: 'react-filter',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: ['react'],
    },
  },
})

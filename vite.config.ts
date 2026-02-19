import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactScopedCssPlugin(),
    tsconfigPaths(),
    viteCompression()
  ],
  server: {
    port: 4205
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       includePaths: [
  //         "src/styles"
  //       ]
  //     }
  //   }
  // },
  // resolve: {
  //   dedupe: ['react', 'react-dom'],
  // },
})

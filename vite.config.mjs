import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap']
        }
      }
    }
  },
  plugins: [
    handlebars({
      context: {
        site: {
          year: new Date().getFullYear(),
          phone: '(267) 309-9000',
          phoneLink: 'tel:+12673099000',
          email: 'contact@keystonenotarygroup.com',
          domain: 'https://www.keystonenotarygroup.com'
        }
      },
      partialDirectory: [
        path.resolve(__dirname, 'src/partials/layout'),
        path.resolve(__dirname, 'src/partials/sections')
      ]
    })
  ]
});

import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(process.cwd(), 'src'),
  publicDir: path.resolve(process.cwd(), 'public'),
  build: {
    outDir: path.resolve(process.cwd(), 'dist'),
    emptyOutDir: true
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
        path.resolve(process.cwd(), 'src/partials/layout'),
        path.resolve(process.cwd(), 'src/partials/sections')
      ]
    })
  ]
});

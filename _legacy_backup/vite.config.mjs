import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const partialDirs = ['src/partials/layout', 'src/partials/sections'];

// Manually register partials to avoid Windows path separator issues during build
const registerPartials = () => {
  partialDirs.forEach((dir) => {
    const fullDir = path.resolve(__dirname, dir);
    readdirSync(fullDir)
      .filter((file) => file.endsWith('.hbs'))
      .forEach((file) => {
        const partialName = path.parse(file).name;
        const filePath = path.join(fullDir, file);
        Handlebars.registerPartial(partialName, readFileSync(filePath, 'utf8'));
      });
  });
};

registerPartials();

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
          phone: "(267) 309-9000",
          phoneLink: "tel:+12673099000",
          email: "contact@keystonenotarygroup.com",
          domain: "https://www.keystonenotarygroup.com"
        }
      }
    })
  ]
});

// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// IMPORTANTE: trocar `site` pelo domínio real do cliente antes do deploy
export default defineConfig({
  site: 'https://barcelonapubcrawlbyking.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
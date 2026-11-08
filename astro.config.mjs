import { defineConfig, fontProviders } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Fully static site: the content lives in src/data/, there is nothing to fetch
export default defineConfig({
  // Change it to the real domain, it's used for the canonical and social image URLs
  site: 'https://example.com',
  integrations: [vue()],
  devToolbar: { enabled: false },
  // Downloaded from Google Fonts at build time and self-hosted, rendered by <Font/> in UI/Head.astro
  // DM Mono only goes up to 500: heavier weights (800 buttons, semibold <strong>) are synthesized by the browser
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'DM Mono',
      cssVariable: '--font-dm-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      weights: [400, 500],
      styles: ['normal', 'italic']
    }
  ],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundled at startup so Vite doesn't re-optimize mid-session
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'gsap/EasePack', 'lenis'] }
  }
});

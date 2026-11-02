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
  // Self-hosted fonts from src/assets/fonts/, rendered by <Font/> in UI/Head.astro
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Akkurat Mono',
      cssVariable: '--font-akkurat-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/AkkuratMonoTrialWeb-Regular.woff2'], weight: 400, style: 'normal' },
          { src: ['./src/assets/fonts/AkkuratMonoTrialWeb-Italic.woff2'], weight: 400, style: 'italic' },
          { src: ['./src/assets/fonts/AkkuratMonoTrialWeb-Bold.woff2'], weight: 700, style: 'normal' },
          { src: ['./src/assets/fonts/AkkuratMonoTrialWeb-BoldItalic.woff2'], weight: 700, style: 'italic' }
        ]
      }
    }
  ],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundled at startup so Vite doesn't re-optimize mid-session
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger'] }
  }
});

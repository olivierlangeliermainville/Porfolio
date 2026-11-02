# Portfolio

One-page portfolio built with [Astro](https://docs.astro.build), Vue 3 islands, Tailwind CSS 4 and GSAP. It's a static site: all the content lives in `src/data/`, with no CMS and no fetching.

## Getting started

Requires Node 22 (see `.nvmrc`).

```sh
nvm use
yarn install
yarn dev       # http://localhost:4321
```

| Command        | Action                              |
| -------------- | ----------------------------------- |
| `yarn dev`     | Dev server                          |
| `yarn build`   | Static build to `dist/`             |
| `yarn preview` | Serves the last build               |

## Editing the content

| File                     | What's in it                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `src/data/site.js`       | SEO, your name/role/headline, about text, skills, experience, socials, nav |
| `src/data/projects.js`   | The `projects` array, in display order                             |

To add a project, copy an object in `projects.js`:

```js
{
  title: 'My project',
  client: 'Client name',          // optional
  year: 2026,
  description: 'One or two lines, <strong>html</strong> allowed.', // optional
  tags: ['Website', 'WebGL'],     // optional, feed the filter
  cover: { src: '/projects/my-project.jpg', alt: 'Homepage of My project' },
  to: 'https://my-project.com',   // optional, makes the card a link
  featured: true                  // optional, full-width card
}
```

Covers can be a file in `public/` (`'/projects/x.jpg'`), an imported file
(`import cover from '@/assets/images/x.jpg'`), or either one wrapped as `{ src, alt }`.
The placeholder covers in `public/projects/` can be deleted once you have real ones.

## Structure

```
src/
├── data/            # site.js and projects.js: the content
├── pages/           # index.astro, the only route
├── layouts/         # Layout.astro: head, nav, footer, fade script
├── components/
│   ├── Common/      # Base components: Button, Text, Image, Icon, Tag, MaybeLink
│   ├── UI/          # Site chrome: Head, Nav, Footer
│   └── Home/        # Sections: Hero, Work (+ ProjectList, ProjectCard), About, Contact
├── composables/     # useFade (GSAP), useInteractiveTag (a / button switch)
├── lib/             # Helpers: motion, url, image, hasSlotContent
├── styles/          # Tailwind theme: colors, fonts, spacing, grid
└── assets/icons/    # svg icons used by <Icon name="..."/>
```

## Conventions

- **Imports** use the `@/` alias for `src/`.
- **Design tokens** live in `src/styles/`: colors by role (`bg-primary`, `text-muted`), spacing (`p-s`, `gap-xl`, `py-section`), text sizes (`text-heading-1`, used through `<Text size="heading-1"/>`), the grid (`md:grid-layout-12`, `container-page`) and durations (`duration-(--duration-slow)`). To re-theme, change the values in `colors.css` and `fonts.css` (plus the local fonts in `astro.config.mjs` and the Google Fonts URL in `UI/Head.astro`).
- **Animations**: put `data-fade` on an element to fade it in on load, add `data-scroll` to wait until it's in view, `data-delay="0.2"` to stagger. JS animations check `prefersReducedMotion()` from `src/lib/motion.js`. Don't use `data-fade` inside a hydrated Vue island (it re-renders without the fade).
- **Vue components** are islands (`client:visible`) only when they need interactivity, like the project filter. Otherwise they render to static HTML.
- **Icons**: drop an svg drawn with `currentColor` in `src/assets/icons/` and use it by file name.

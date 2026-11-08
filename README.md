# Portfolio

One-page portfolio built with [Astro](https://docs.astro.build), Vue 3 islands, Tailwind CSS 4 and GSAP. It's a static site: all the content lives in `src/data/`, with no CMS and no fetching.

## Getting started

Requires Node 22 (see `.nvmrc`).

```sh
nvm use
yarn install
yarn dev       # http://localhost:4321
```

| Command        | Action                  |
| -------------- | ----------------------- |
| `yarn dev`     | Dev server              |
| `yarn build`   | Static build to `dist/` |
| `yarn preview` | Serves the last build   |

## Editing the content

| File                   | What's in it                                                               |
| ---------------------- | -------------------------------------------------------------------------- |
| `src/data/site.js`     | SEO, your name/role/intro, every section's labels, socials, nav, languages |
| `src/data/projects.js` | The featured `projects` (in display order) and the `trials` list           |

To add a project, copy an object in `projects.js`:

```js
{
  title: 'My project',            // shown very large
  year: 2026,
  link: { label: 'https://my-project.com', to: 'https://my-project.com' }, // optional
  stack: 'Nuxt, Vue.js',          // optional
  media: [{ src: '/projects/my-project/home.jpg', alt: 'Homepage of My project', ar: '16/9' }]
}
```

Media can be a file in `public/` (`'/projects/my-project/x.jpg'`, one folder per project), an imported file
(`import cover from '@/assets/images/x.jpg'`), or either one wrapped as `{ src, alt }`.
Each project and trial has its folder in `public/projects/`, named after its title. Put its images and videos there.

## Structure

```
src/
├── data/            # site.js and projects.js: the content
├── pages/           # index.astro, the only route
├── layouts/         # Layout.astro: head, nav, footer, fade script
├── components/
│   ├── Common/      # Base components: Button, Text, Image, Icon, Clock
│   ├── UI/          # Site chrome: Head, Nav, GridLines (the faint column lines behind the page)
│   └── Home/        # Sections: Hero, Trials, About, Contact, and the parts they share
│       │            # (ProjectInfo, NameRow)
│       └── Work/    # The featured projects: Work.astro and its parts (Band, Names, Media, Mobile)
│           └── scripts/  # Its animation: index.ts wires band, names, infos, media, drag (desktop)
│                         # and mobile.ts; the timings and sizes to tweak are in config.ts
├── composables/     # Page-wide behaviors: useFade, useSmoothScroll, useGridCenter,
│                    # useInteractiveTag
├── lib/             # Helpers: format (numbers, time), pixels (the grey and pixelated media
│                    # shared by Work, Trials and About), motion, url, image, hasSlotContent
├── styles/          # Tailwind theme: colors, fonts, spacing, grid
└── assets/icons/    # svg icons used by <Icon name="..."/>
```

## Conventions

- **Imports** use the `@/` alias for `src/`.
- **Design tokens** live in `src/styles/`: colors by role (`bg-primary`, `text-muted`), spacing (`p-s`, `gap-xl`, `py-section`), text sizes (`text-mono`, used through `<Text size="mono"/>`; `size="display"` is the very large type, sized by its parent in `cqw`), the grid (`md:grid-layout-12`, `container-page`) and durations (`duration-(--duration-slow)`). To re-theme, change the values in `colors.css` and `fonts.css` (plus the local fonts in `astro.config.mjs` and the Google Fonts URL in `UI/Head.astro`).
- **Alignment**: all text starts 4px inside its grid line. Free text uses `px-cell` / `mx-cell`. White ledger rows sit 1px in from the lines (`mx-px`) with `p-xxxs` (info rows) or `row-title` (name rows and the empty lines between them). Use only the named spacing tokens, no raw Tailwind numbers (`px-1`, `gap-10`).
- **Animations**: put `data-fade` on an element to fade it in on load, add `data-scroll` to wait until it's in view, `data-delay="0.2"` to stagger. JS animations check `prefersReducedMotion()` from `src/lib/motion.js`. Don't use `data-fade` inside a hydrated Vue island (it re-renders without the fade).
- **Vue components** are islands (`client:visible`) only when they need interactivity (none do at the moment). Otherwise they render to static HTML.
- **Icons**: drop an svg drawn with `currentColor` in `src/assets/icons/` and use it by file name.

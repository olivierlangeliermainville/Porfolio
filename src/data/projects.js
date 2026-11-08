/**
 * Your featured projects, in the order they appear on the home page (numbered 01, 02...).
 * To add one, copy an object and change its values.
 *
 * Fields:
 * - title        required, in the list of names, shown very large while the project is active
 * - year         required, ex: 2025 or '2024 — 2025'
 * - link         optional, `{ label, to }`, shown in the info list and used by the button
 * - stack        optional, ex: 'Nuxt, Vue.js'
 * - media        optional, images stacked in the last column, one project after the other. Each one is either:
 *                  a path to a file in public/:      '/projects/my-project/home.jpg'
 *                  an imported file (optimized size): import myCover from '@/assets/images/my-cover.jpg'
 *                  either one with an alt and ratio:  { src: myCover, alt: 'Homepage of ...', ar: '16/9' }
 *                a gif works like an image. A video (.mp4, .webm, .mov) plays muted and looped, like a gif,
 *                give it a ratio:                   { src: '/projects/my-project/scroll.mp4', alt: '...', ar: '16/9' }
 */

export const projects = [
  {
    title: 'LG2',
    year: 2026,
    link: { label: 'https://lg2.com', to: 'https://lg2.com' },
    stack: 'Nuxt, Vue.js, TailwindCSS, GraphQL, DatoCMS, GSAP, GLSL, Lenis',
    media: [
      { src: '/projects/lg2/intro.mp4', alt: 'LG2 letter grid animation', ar: '1/1' },
      { src: '/projects/lg2/sticker.svg', alt: 'LG2 sticker, a hand drawn OK hand', ar: '1/1' },
      { src: '/projects/lg2/carreer.mp4', alt: 'LG2 careers page, "Notre carburant c’est le talent"', ar: '16/9' },
      { src: '/projects/lg2/peek.mp4', alt: 'LG2 Peek, the story viewer of employee portraits', ar: '1588/1230' },
      {
        src: '/projects/lg2/404.png',
        alt: 'LG2 404 page, "Cette page est vide. Laisses ta marque." surrounded by hand drawn stickers',
        ar: '1/1'
      }
    ]
  },
  {
    title: 'Superqueer',
    year: 2026,
    stack: 'Astro, Vue.js, TailwindCSS, GraphQL, DatoCMS, GSAP, GLSL, Lenis',
    media: [
      {
        src: '/projects/superqueer/intro1.mp4',
        alt: 'Superqueer homepage, "Safe spaces, wherever you go"',
        ar: '2894/1588'
      },
      { src: '/projects/superqueer/shader.mp4', alt: 'Superqueer gradient shader', ar: '1/1' }
    ]
  },
  {
    title: 'Flamingo',
    year: 2026,
    link: { label: 'https://flamingo.ca', to: 'https://www.flamingo.ca' },
    stack: 'Nuxt, Vue.js, TailwindCSS, Storyblok, GSAP, Lenis',
    media: [
      {
        src: '/projects/flamingo/hero.png',
        alt: 'Flamingo homepage, "Sur pattes depuis 1958" with an illustrated flamingo among flowers',
        ar: '1702/1091'
      },
      {
        src: '/projects/flamingo/about.png',
        alt: 'Flamingo, "À savourer avec ceux que vous aimez", lifestyle photos with illustrated stickers',
        ar: '1602/1006'
      }
    ]
  }
];

/**
 * Side projects and experiments, listed in "Trials + Errors", numbered 01, 02... Same fields as a
 * project (title, year, link, stack), plus:
 * - description  optional, html allowed
 * - media        optional, same formats as a project's, stacked under the info, full width
 */
export const trials = {
  title: 'Trials & Errors',
  items: [
    {
      title: 'Endless portfolio creator',
      year: '2022 — 2026',
      stack: 'Vue, Nuxt, React, Astro, TailwindCSS, Motion.dev, GSAP, WebGL, GLSL, Three.js & MORE ',
      description:
        'Since my first day in web, I’ve been redesigning and recoding my portfolio. Each version taught me something new, and each one ended the same way: almost there, but not quite. So I’d start over with a new idea and a new stack. This one finally feels good enough to ship. After all, I had to put one out there someday!',
      media: [
        {
          src: '/trials/portfolio/recording.mp4',
          alt: 'Portfolio version with a cluster of colorful patterned tiles following the cursor',
          ar: '2902/1568'
        },
        {
          src: '/trials/portfolio/heatmap.png',
          alt: 'Portfolio version with a heatmap gradient shader, "Engineering digital art."',
          ar: '2934/1592'
        },
        {
          src: '/trials/portfolio/yellow.mp4',
          alt: 'Portfolio version with giant yellow letters behind "Crafting digital excellence"',
          ar: '1/1'
        },
        {
          src: '/trials/portfolio/olm.png',
          alt: 'Portfolio version with a halftone dot background and a large "OLM" logotype',
          ar: '2460/1580'
        }
      ]
    },
    {
      // TODO: real title, year and stack
      title: 'Env',
      year: 2026,
      link: { label: 'https://env-test-threejs.netlify.app', to: 'https://env-test-threejs.netlify.app/' },
      stack: 'Three.js, WebGL, GLSL',
      description:
        'I wanted to build an immersive environment on the web, and use it to learn instancing and performance optimization at this level of detail. So I vibe coded it, focusing on the big picture to really grasp the performance tactics rather than every line. Alongside it, I wrote a companion library that explains each choice and how the whole thing works. In short: a vibe coded project made for me to read, dissect and understand.',
      media: [
        { src: '/trials/env/env.mp4', alt: 'Walking through a 3D environment under a red sky', ar: '2924/1590' },
        {
          src: '/trials/env/beacon.png',
          alt: 'Dark rock formations in a grass field, beams of light falling from a red sky',
          ar: '2926/1592'
        },
        {
          src: '/trials/env/wall.png',
          alt: '"The wall", a dark slab in the grass against a red and pink sky',
          ar: '1/1'
        }
      ]
    },
    {
      // TODO: real year, stack and description
      title: 'Shader',
      year: 2026,
      stack: 'Three.js, WebGL, GLSL',
      description:
        'A playground of custom shaders, all applied to the same fire hydrant model. Flip through them one by one or see them side by side in a grid.',
      media: [
        {
          src: '/trials/shader/shader.mp4',
          alt: 'Flipping through shaders on a 3D fire hydrant, from red and blue to toon shading',
          ar: '2066/1578'
        }
      ]
    }
  ]
};

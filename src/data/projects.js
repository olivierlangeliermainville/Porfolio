/**
 * Your projects, in the order they appear on the home page.
 * To add one, copy an object and change its values.
 *
 * Fields:
 * - title        required
 * - year         required, ex: 2025 or '2024 — 2025'
 * - client       optional
 * - description  optional, html allowed
 * - tags         optional, used by the filter above the list
 * - cover        required. Either:
 *                  a path to a file in public/:      '/projects/my-project.jpg'
 *                  an imported file (optimized size): import myCover from '@/assets/images/my-cover.jpg'
 *                  either one with an alt:            { src: myCover, alt: 'Homepage of ...' }
 * - to           optional link (live site, case study...), opens in a new tab when external
 * - featured     optional, true shows the project large (full width)
 */

export const projects = [
  {
    title: 'Northwind Studio',
    client: 'Northwind',
    year: 2025,
    description: 'Marketing site with a WebGL hero and page transitions, content from a headless CMS.',
    tags: ['Website', 'WebGL'],
    cover: { src: '/projects/northwind.svg', alt: 'Northwind Studio homepage' },
    to: 'https://example.com',
    featured: true
  },
  {
    title: 'Field Notes',
    client: 'Field Notes Magazine',
    year: 2025,
    description: 'Editorial platform with a fluid type system and scroll-driven animations.',
    tags: ['Website', 'Editorial'],
    cover: { src: '/projects/field-notes.svg', alt: 'Field Notes article page' },
    to: 'https://example.com'
  },
  {
    title: 'Pulse',
    client: 'Pulse Festival',
    year: 2024,
    description: 'Campaign microsite and lineup builder for a music festival.',
    tags: ['Campaign', 'Interactive'],
    cover: { src: '/projects/pulse.svg', alt: 'Pulse lineup page' }
  },
  {
    title: 'Atlas',
    client: 'Atlas Maps',
    year: 2024,
    description: 'Design system and component library in Vue, documented in a living styleguide.',
    tags: ['Design system'],
    cover: { src: '/projects/atlas.svg', alt: 'Atlas component library' },
    to: 'https://example.com'
  },
  {
    title: 'Photobooth',
    year: 2023,
    description: 'In-store photobooth app with camera filters and instant sharing.',
    tags: ['Interactive', 'Installation'],
    cover: { src: '/projects/photobooth.svg', alt: 'Photobooth capture screen' }
  }
];

/**
 * Images in src/data can be written three ways, this returns `{ src, width, height, alt }` for all of them:
 * - a string: `'/projects/alpha.jpg'` (file in public/) or `'https://...'`
 * - an imported file: `import cover from '@/assets/images/alpha.jpg'` (Astro gives `{ src, width, height }`)
 * - an object: `{ src: cover, alt: 'Description' }` or `{ src: '/projects/alpha.jpg', alt: '...' }`
 */
export function resolveImage(image) {
  if (!image) return null;
  if (typeof image === 'string') return { src: image };

  // `{ src: importedFile, alt }`
  if (image.src && typeof image.src === 'object') {
    return { ...image.src, alt: image.alt };
  }

  return image;
}

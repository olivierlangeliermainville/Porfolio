/** True for links leaving the site: `https://other.com`, `mailto:`, `tel:` */
export function isExternalLink(url) {
  if (!url) return false;
  return /^(https?:)?\/\//i.test(url) || /^(mailto|tel):/i.test(url);
}

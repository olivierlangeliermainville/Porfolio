import gsap from 'gsap';
import { createBand } from './band';
import { initDesktop } from './desktop';
import { initMobile } from './mobile';

/**
 * The work section (see Work.astro): desktop.js and mobile.js, both rolling the band (band.js)
 */
export function initWork() {
  const section = document.querySelector('[data-work]');
  if (!section) return;

  const band = createBand(section);
  gsap.matchMedia().add('(min-width: 768px)', () => initDesktop(section, band));
  gsap.matchMedia().add('(max-width: 767px)', () => initMobile(section, band));
}

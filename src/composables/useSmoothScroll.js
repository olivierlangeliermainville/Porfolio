import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

/** @type {Lenis | undefined} */
let instance;

/**
 * Scrolls the page to `y` px, with Lenis when it's running, otherwise natively.
 * Smooth, the visitor can't scroll during it and `onComplete` is called once it's there.
 * `immediate` jumps there, ex: when the page animates the change itself.
 *
 * @param {number} y
 * @param {{ immediate?: boolean, onComplete?: () => void }} [options]
 * @example
 * scrollToY(section.offsetTop, { onComplete: () => console.log('arrived') });
 */
export function scrollToY(y, { immediate = false, onComplete } = {}) {
  if (instance) {
    instance.scrollTo(y, { duration: 1.2, lock: true, force: true, immediate, onComplete });
    return;
  }

  const isInstant = immediate || prefersReducedMotion() || Math.abs(window.scrollY - y) < 1;
  if (onComplete && !isInstant) window.addEventListener('scrollend', () => onComplete(), { once: true });
  window.scrollTo({ top: y, behavior: isInstant ? 'auto' : 'smooth' });
  if (onComplete && isInstant) onComplete();
}

/**
 * Stops the page from scrolling, ex: while a modal is open, or lets it scroll again
 *
 * @param {boolean} isLocked
 */
export function setScrollLocked(isLocked) {
  if (isLocked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = isLocked ? 'hidden' : '';
}

/**
 * Smooth scroll with Lenis, driven by the GSAP ticker so ScrollTrigger stays in sync
 * Called once from Layout.astro. Skipped when motion is reduced (native scroll).
 *
 * @returns {Lenis | undefined} the instance, ex: to `lenis.stop()` while a modal is open
 */
export function useSmoothScroll() {
  if (prefersReducedMotion()) return;

  // `anchors`: in-page links (#work, #about) scroll smoothly too
  const lenis = new Lenis({ autoRaf: false, anchors: true });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  instance = lenis;
  return lenis;
}

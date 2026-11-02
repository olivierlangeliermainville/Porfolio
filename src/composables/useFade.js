import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades and lifts in every `[data-fade]`, on page load or when scrolled into view
 *
 * Put `data-fade` on any element, it's hidden by global.css until it plays.
 * Called once from Layout.astro.
 *
 * @example
 * <div data-fade>Plays on page load</div>
 * <div data-fade data-scroll data-delay="0.2">Plays when scrolled into view</div>
 */
export function useFade(root = document) {
  if (prefersReducedMotion()) return;

  root.querySelectorAll('[data-fade]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: Number(el.dataset.duration ?? 0.8),
        delay: Number(el.dataset.delay ?? 0),
        ease: 'power3.out',
        // `data-scroll`: waits for the element to come into view, otherwise plays on page load
        scrollTrigger: el.hasAttribute('data-scroll') ? { trigger: el, start: 'top 85%', once: true } : undefined
      }
    );
  });

  // Trigger positions are measured once: recompute them when the page height changes
  // (the project filter, web fonts swapping in, images loading), or the sections below never play
  let frame;
  new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => ScrollTrigger.refresh());
  }).observe(document.body);
}

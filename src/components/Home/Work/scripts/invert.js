import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * The inverted copy over an active name, like a highlighted line in a ledger: it slides in from
 * the left when the name becomes active, and out to the right when it's no longer. Also used by
 * Trials. `animate` false jumps to the end, ex: on a refresh.
 *
 * A fill always completes before it retracts: scrolling fast past a few names, each one fills
 * fully then slides out, instead of a sliver coming in and going right away
 */
const fills = new WeakMap();
const retracts = new WeakMap();

export function slideInvert(invert, isActive, animate = true) {
  const duration = !animate || prefersReducedMotion() ? 0 : 0.6;
  const ease = 'expo.inOut';
  const fill = fills.get(invert);
  const isFilling = duration > 0 && !!fill?.isActive();

  if (isActive) {
    // Active again while still filling: the fill goes on, the retract waiting for it is cancelled
    if (isFilling) {
      retracts.get(invert)?.kill();
      return;
    }
    const tween = gsap.fromTo(
      invert,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration, ease, overwrite: true }
    );
    fills.set(invert, tween);
  } else {
    // Out to the right, once the fill is complete
    const delay = isFilling ? fill.duration() - fill.time() : 0;
    retracts.set(
      invert,
      gsap.to(invert, { clipPath: 'inset(0% 0% 0% 100%)', duration, ease, delay, overwrite: !delay })
    );
  }
}

/**
 * Marks the element at `index` with `data-active` and slides the inverts: in for the newly active
 * one, out for the one that was. The others don't move
 */
export function markActive(items, inverts, index) {
  items.forEach((item, itemIndex) => {
    const isActive = itemIndex === index;
    if (item.hasAttribute('data-active') === isActive) return;

    item.toggleAttribute('data-active', isActive);
    slideInvert(inverts[itemIndex], isActive);
  });
}

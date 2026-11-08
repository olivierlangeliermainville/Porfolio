import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { padNumber } from '@/lib/format';
import { prefersReducedMotion } from '@/lib/motion';
import { addColorSwitch, createPixels, getPixelSize } from '@/lib/pixels';
import { markActive } from './invert';

/**
 * Mobile (see WorkMobile.astro): the project whose block crosses the middle of the screen is active, its name
 * row inverted and its media in color (CSS, from `data-active`), and the band rolls to it.
 * Like on desktop, a new roll cuts the one playing. -1 is before the first project (00), `count` after the last one.
 *
 * The media are pixelated like on desktop (src/lib/pixels.js): the blocks bigger with their
 * distance from the line, and their project's `mix` resolving them to sharp with its color on a
 * switch.
 *
 * Called in a gsap.matchMedia() context, returns the cleanup.
 */
export function initMobile(section, band) {
  const mobileProjects = [...section.querySelectorAll('[data-work-mobile-project]')];
  // The inverted copy of each project's name row (NameRow.astro)
  const mobileInverts = mobileProjects.map((project) => project.querySelector('[data-name-row-invert]'));
  const mobileMediaItems = [...section.querySelectorAll('[data-work-mobile-media-item]')];
  const count = mobileProjects.length;
  // A project is active while its block crosses the middle of the screen, like in Trials
  const getLine = () => window.innerHeight / 2;

  // The pixelated media: each project has a pixel mix, 1 pixelated, 0 sharp
  const pixels = createPixels(mobileMediaItems);
  const itemProjects = mobileMediaItems.map((item) => mobileProjects.findIndex((project) => project.contains(item)));
  const pixelMixes = mobileProjects.map(() => ({ value: 1 }));

  /** Blocks bigger with the distance from the line, smaller with their project's mix */
  const pixelate = () => {
    const line = getLine();
    mobileMediaItems.forEach((item, itemIndex) => {
      const mix = pixelMixes[itemProjects[itemIndex]]?.value ?? 1;
      const { top, bottom, width } = item.getBoundingClientRect();
      pixels.draw(itemIndex, getPixelSize(Math.max(0, top - line, line - bottom), mix), width);
    });
  };

  let activeIndex = -1;
  let timeline;

  // The last block whose top passed the line, `count` once the last one's bottom passed it too
  const getWanted = () => {
    const line = getLine();
    const passed = mobileProjects.filter((project) => project.getBoundingClientRect().top <= line);
    const isPastLast = passed.length === count && mobileProjects[count - 1].getBoundingClientRect().bottom < line;

    return isPastLast ? count : passed.length - 1;
  };

  const goTo = (active, animate) => {
    timeline?.kill();
    activeIndex = active;

    const isAnimated = animate && !prefersReducedMotion();
    markActive(mobileProjects, mobileInverts, active);
    // Only the active project's videos play (also the ones of the desktop layout, paused here)
    section.querySelectorAll('video').forEach((video) => {
      if (mobileProjects[active]?.contains(video)) video.play().catch(() => {});
      else video.pause();
    });

    timeline = gsap.timeline().addLabel('switch');
    band.rollTo(active, isAnimated);
    // The pixels resolve with the color (CSS): quick out for the others, smooth in for the active
    addColorSwitch(timeline, pixelMixes, active, isAnimated, (isColor) => ({
      value: isColor ? 0 : 1,
      onUpdate: pixelate
    }));

    if (!animate) timeline.progress(1);
  };

  // The counter under each carousel: the media shown, the one snapped to the start. At the end of
  // the row the last ones can't reach the start, the last is shown once it's scrolled to the end
  const removeCarouselListeners = mobileProjects.flatMap((project) => {
    const carousel = project.querySelector('[data-work-mobile-carousel]');
    const counter = project.querySelector('[data-work-mobile-count]');
    if (!carousel || !counter) return [];

    const items = [...carousel.children];
    const update = () => {
      const isAtEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1;
      // Where the items snap, on screen: the row's left plus its scroll padding
      const snapLeft =
        carousel.getBoundingClientRect().left + parseFloat(getComputedStyle(carousel).scrollPaddingLeft || '0');
      const distances = items.map((item) => Math.abs(item.getBoundingClientRect().left - snapLeft));
      const shown = isAtEnd ? items.length - 1 : distances.indexOf(Math.min(...distances));
      counter.textContent = padNumber(shown + 1);
    };
    carousel.addEventListener('scroll', update, { passive: true });
    return [() => carousel.removeEventListener('scroll', update)];
  });

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onRefresh: () => {
      band.measure();
      pixels.reset();
      goTo(getWanted(), false);
      pixelate();
    },
    onUpdate: () => {
      pixelate();
      const wanted = getWanted();
      if (wanted !== activeIndex) goTo(wanted, true);
    }
  });

  return () => {
    trigger.kill();
    timeline?.kill();
    markActive(mobileProjects, mobileInverts, -1);
    pixels.destroy();
    removeCarouselListeners.forEach((removeListener) => removeListener());
  };
}

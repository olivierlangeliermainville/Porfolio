import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToY } from '@/composables/useSmoothScroll';
import { padNumber } from '@/lib/format';
import { prefersReducedMotion } from '@/lib/motion';
import { addColorSwitch, createPixels, getPixelSize } from '@/lib/pixels';
import { markActive, slideInvert } from './invert';

gsap.registerPlugin(ScrollTrigger);

const { clamp, interpolate } = gsap.utils;

// Each media takes this many px of scroll to pass the line
const MEDIA_SCROLL = 120;
// A media grows when it is within this many screens of the line
const GROW_RANGE = 0.35;
const easeGrowth = gsap.parseEase('power2.inOut');

export function initDesktop(section, band) {
  const $ = (selector) => section.querySelector(selector);
  const $$ = (selector) => [...section.querySelectorAll(selector)];

  // ------ GENERAL ----------------------------------------------------
  const stage = $('[data-work-stage]');
  const labels = [...$('[data-work-columns]').children];

  // ------ NAME -------------------------------------------------------
  const dragArea = $('[data-work-names-drag]');
  const nameList = $('[data-work-names]');
  const names = $$('[data-work-name]');
  const inverts = names.map((name) => name.querySelector('[data-work-name-invert]'));
  const hovers = names.map((name) => name.querySelector('[data-work-name-hover]'));

  // ------ INFOS ------------------------------------------------------
  const infoStack = $('[data-work-infos]');
  const infos = $$('[data-work-info]');
  const infoRows = infos.map((info) =>
    [...info.children].flatMap((child) => (child.tagName === 'DL' ? [...child.children] : [child]))
  );

  // ------ MEDIA ------------------------------------------------------
  const medias = $('[data-work-media]');
  const mediaGroups = $$('[data-work-media-group]');
  const mediaItems = $$('[data-work-media-item]');
  const mediaCount = $('[data-work-media-count]');

  // ------ PROJECTS (counted in media, never in px) -------------------
  const projectCount = names.length;
  const mediaTotal = mediaItems.length;
  const mediaPerProject = mediaGroups.map((group) => group.querySelectorAll('[data-work-media-item]').length);
  // firstMediaOf[p] = index of project p's first media
  const firstMediaOf = mediaPerProject.map((_, p) => mediaPerProject.slice(0, p).reduce((a, b) => a + b, 0));
  // projectOfMedia[i] = project that owns media i
  const projectOfMedia = mediaItems.map((item) => mediaGroups.findIndex((group) => group.contains(item)));

  // ------ PIXELS -----------------------------------------------------
  const pixels = createPixels(mediaItems);
  const pixelMixes = mediaGroups.map(() => ({ value: 1 }));

  let scrollProgress = 0; // 0 to 1 through the whole section
  let activeIndex = -1; // -1 before the section, projectCount after the last media
  let infoIndex = -1; // the project whose info is currently shown
  let switchTimeline;
  let trigger;

  const setupProgress = () => {
    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onRefreshInit: setupLayout,
      onRefresh: (self) => {
        scrollProgress = self.progress;
        switchActiveProject(getActiveIndex(getPosition()), false);
        render();
      },
      onUpdate: (self) => {
        scrollProgress = self.progress;
        render();
        updateActiveIndex();
      }
    });
  };

  // ------ NAMELIST ---------------------------------------------------
  let namePositions = []; // how far down the list each name sits, plus one extra stop for the outro
  let nameListY = 0;

  const setupTranslateNameList = () => {
    const listTop = nameList.getBoundingClientRect().top;
    namePositions = names.map((name) => name.getBoundingClientRect().top - listTop);
    const lastName = names[projectCount - 1];
    namePositions.push(namePositions[projectCount - 1] + lastName.offsetHeight + endActiveLine);
  };

  const updateTranslateNameList = (position) => {
    const project = getProjectAt(position);
    const first = firstMediaOf[project];
    // The last project runs to the end of the scroll
    const next = firstMediaOf[project + 1] ?? scrollLength / MEDIA_SCROLL;
    const projectProgress = clamp(0, 1, (position - first) / (next - first));
    nameListY = activeLineY - interpolate(namePositions[project], namePositions[project + 1], projectProgress);
    gsap.set(nameList, { y: nameListY });
  };

  // ------ INFOS ------------------------------------------------------
  const updateTranslateInfos = () => {
    gsap.set(infoStack, { y: nameListY + (namePositions[infoIndex] ?? 0) });
  };

  // ------ MEDIAS -----------------------------------------------------
  const updateTranslateMedias = (position) => {
    const passedHeight = mediaHeights.reduce((sum, height, i) => {
      const passed = position - i;
      // The last media keeps sliding past the line, the others stop once fully passed
      return sum + height * (i === mediaTotal - 1 ? Math.max(0, passed) : clamp(0, 1, passed));
    }, 0);
    gsap.set(medias, { y: activeLineY - passedHeight });
  };

  // ------ POSITION ---------------------------------------------------
  let scrollLength = 0; // px of scroll the whole section is worth

  // One slot of scroll per media, plus room at the end for the last one to shrink back
  const setupPosition = () => {
    scrollLength = mediaTotal * MEDIA_SCROLL + growDistance;
  };

  // Which media is on the line: 0 = first, 2.4 = third media, 40% through
  function getPosition() {
    return (scrollProgress * scrollLength) / MEDIA_SCROLL;
  }

  // The project that owns the media at this position
  function getProjectAt(position) {
    return Math.max(0, firstMediaOf.filter((first) => first <= position).length - 1);
  }

  // ------ MEDIA SCALE ------------------------------------------------
  let mediaRatios = []; // width / height of each media
  let mediaFullHeights = []; // height of each media when fully grown
  let mediaHeights = []; // height of each media this frame
  let growDistance = 0; // px of scroll within which a media grows

  const setupScaleMedias = () => {
    growDistance = window.innerHeight * GROW_RANGE;
    const columnWidth = medias.clientWidth;
    gsap.set(mediaItems, { width: columnWidth });
    mediaRatios = mediaItems.map((item) => item.offsetWidth / item.offsetHeight);
    mediaFullHeights = mediaRatios.map((ratio) => Math.min(columnWidth / ratio, columnWidth));
    // The pixel canvases follow the new sizes
    pixels.reset();
  };

  const updateScaleMedias = (position) => {
    mediaHeights = mediaFullHeights.map((fullHeight, i) => {
      const distance = Math.abs(position - i) * MEDIA_SCROLL;
      const closeness = clamp(0, 1, 1 - distance / growDistance);
      return interpolate(MEDIA_SCROLL, fullHeight, easeGrowth(closeness));
    });
    gsap.set(mediaItems, { width: (i) => mediaHeights[i] * mediaRatios[i] });
  };

  // ------ MEDIA PIXELS -----------------------------------------------
  const updatePixels = (position) => {
    mediaHeights.forEach((height, i) => {
      const distance = Math.max(0, i - position, position - i - 1) * MEDIA_SCROLL;
      const mix = pixelMixes[projectOfMedia[i]].value;
      pixels.draw(i, getPixelSize(distance, mix), height * mediaRatios[i]);
    });
  };

  // ------ ACTIVE LINE ------------------------------------------------
  let startActiveLine = 0;
  let endActiveLine = 0;
  let activeLineY = 0;

  const setupActiveLine = () => {
    const tallest = Math.max(...names.map((name) => name.offsetHeight), ...infos.map((info) => info.offsetHeight));
    startActiveLine = Math.max(0, stage.clientHeight - tallest);
    endActiveLine = Math.min(startActiveLine, 1);
  };
  const updateActiveLine = () => {
    activeLineY = interpolate(startActiveLine, endActiveLine, scrollProgress);
  };

  // ------ ACTIVE INDEX -----------------------------------------------
  function getActiveIndex(position) {
    if (scrollProgress === 0) return -1;
    if (position >= mediaTotal) return projectCount;
    return getProjectAt(position);
  }

  const updateActiveIndex = () => {
    const index = getActiveIndex(getPosition());
    if (index !== activeIndex) switchActiveProject(index, true);
  };

  const switchActiveProject = (index, animate) => {
    activeIndex = index;
    const isAnimated = animate && !prefersReducedMotion();

    markActive(names, inverts, index);
    // The active name has no hover: its accent leaves if it was hovered when it became active
    if (hovers[index]) slideInvert(hovers[index], false);
    band.rollTo(index, isAnimated);
    section.querySelectorAll('video').forEach((video) => {
      if (mediaGroups[index]?.contains(video)) video.play().catch(() => {});
      else video.pause();
    });

    switchTimeline?.kill();
    switchTimeline = gsap.timeline();
    if (infoRows[infoIndex]) {
      switchTimeline.to(infoRows[infoIndex], {
        yPercent: -100,
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 0.2,
        stagger: { each: 0.03, from: 'end' },
        ease: 'power2.in'
      });
    }
    switchTimeline
      .set(infos, { autoAlpha: 0 })
      .addLabel('switch')
      .call(() => {
        infoIndex = index;
        mediaCount.textContent = padNumber(mediaPerProject[index] ?? 0);
        render();
      });
    if (infos[index]) {
      switchTimeline
        .set(infos[index], { autoAlpha: 1 }, 'switch+=0.4')
        .fromTo(
          infoRows[index],
          { yPercent: -100, clipPath: 'inset(100% 0% 0% 0%)' },
          { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, stagger: 0.05, ease: 'expo.out' },
          '<'
        );
    }
    addColorSwitch(switchTimeline, pixelMixes, index, isAnimated, (isColor) => ({
      value: isColor ? 0 : 1,
      onUpdate: render
    }));
    addColorSwitch(switchTimeline, mediaGroups, index, isAnimated, (isColor) => ({
      filter: `grayscale(${isColor ? 0 : 1})`
    }));

    if (!isAnimated) switchTimeline.progress(1);
  };

  // ------ INTRO ------------------------------------------------------
  const setupIntro = () => {
    gsap.fromTo(
      stage,
      { y: () => document.documentElement.clientHeight - stage.offsetTop - startActiveLine },
      {
        y: 0,
        ease: 'power1.in',
        scrollTrigger: { trigger: section, start: 'top 50%', end: 'top top', scrub: true, invalidateOnRefresh: true }
      }
    );
  };

  // ------ LABELS -----------------------------------------------------
  const setupLabels = () => {
    const hiddenLabel = { yPercent: 100, clipPath: 'inset(0% 0% 100% 0%)' };
    const shownLabel = { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)' };
    const isReduced = prefersReducedMotion();
    gsap.set(labels, hiddenLabel);

    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'max',
      onEnter: () =>
        gsap.to(labels, {
          ...shownLabel,
          duration: isReduced ? 0 : 0.6,
          stagger: isReduced ? 0 : 0.1,
          ease: 'expo.out',
          overwrite: true
        }),
      onLeaveBack: () =>
        gsap.to(labels, {
          ...hiddenLabel,
          duration: isReduced ? 0 : 0.28,
          stagger: { each: isReduced ? 0 : 0.05, from: 'end' },
          ease: 'power2.in',
          overwrite: true
        })
    });
  };

  // ------ NAME CLICK AND DRAG ----------------------------------------
  const listeners = new AbortController();
  const { signal } = listeners;
  let dragResetTimeout;

  const setupNameClicks = () => {
    names.forEach((name, project) => {
      const button = name.querySelector('button');
      button.addEventListener(
        'click',
        () => {
          // 1px of scroll past the project's first media, so that project is the active one
          const progress = (firstMediaOf[project] * MEDIA_SCROLL + 1) / scrollLength;
          scrollToY(trigger.start + progress * (trigger.end - trigger.start));
        },
        { signal }
      );

      // The accent copy slides in on hover and out when the mouse leaves, like the invert. Not on
      // the active name: it's already there
      button.addEventListener(
        'pointerenter',
        (event) => {
          if (event.pointerType === 'mouse' && !name.hasAttribute('data-active')) slideInvert(hovers[project], true);
        },
        { signal }
      );
      button.addEventListener(
        'pointerleave',
        (event) => {
          if (event.pointerType === 'mouse') slideInvert(hovers[project], false);
        },
        { signal }
      );
    });
  };

  const setupNameDrag = () => {
    let drag = null;

    dragArea.addEventListener(
      'pointerdown',
      (event) => {
        if (event.button === 0) drag = { pointerY: event.clientY, scrollY: trigger.scroll(), hasMoved: false };
      },
      { signal }
    );

    dragArea.addEventListener(
      'pointermove',
      (event) => {
        if (!drag) return;
        const distance = drag.pointerY - event.clientY;
        if (!drag.hasMoved) {
          if (Math.abs(distance) < 4) return;
          drag.hasMoved = true;
          dragArea.setPointerCapture(event.pointerId);
        }
        const namesTravel = Math.max(
          1,
          namePositions[projectCount - 1] - namePositions[0] + startActiveLine - endActiveLine
        );
        const scrollPerPx = (trigger.end - trigger.start) / namesTravel;
        scrollToY(clamp(trigger.start, trigger.end, drag.scrollY + distance * scrollPerPx), { immediate: true });
      },
      { signal }
    );

    const endDrag = () => {
      dragResetTimeout = setTimeout(() => (drag = null));
    };
    dragArea.addEventListener('pointerup', endDrag, { signal });
    dragArea.addEventListener('pointercancel', endDrag, { signal });
    dragArea.addEventListener(
      'click',
      (event) => {
        if (!drag?.hasMoved) return;
        event.stopPropagation();
        event.preventDefault();
      },
      { capture: true, signal }
    );
  };

  const setupLayout = () => {
    band.measure();
    setupActiveLine();
    setupTranslateNameList();
    setupScaleMedias();
    setupPosition();
  };

  const setup = () => {
    setupLayout();
    setupProgress();
    setupIntro();
    setupLabels();
    setupNameClicks();
    setupNameDrag();
  };

  const render = () => {
    const position = getPosition();
    updateActiveLine();
    updateTranslateNameList(position);
    updateTranslateInfos();
    updateScaleMedias(position);
    updateTranslateMedias(position);
    updatePixels(position);
  };
  setup();

  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  // The triggers and tweens made here are reverted by gsap.matchMedia()
  return () => {
    switchTimeline?.kill();
    clearTimeout(dragResetTimeout);
    listeners.abort();
  };
}

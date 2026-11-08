import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
/**
 * The band at the bottom (WorkBand.astro): the index and the active project's title, used on
 * desktop and mobile. Projects are numbered from 0, -1 is before the first one (00, no title) and
 * `count` the outro (no number, the next section's title).
 *
 * Each digit of the index and the title are a strip of items in a one line window. A roll moves
 * each strip to the active project's item: a new one goes on from where the strip is, so scrolling
 * fast past a few projects rolls through them smoothly. A digit's strip only has a new item when
 * the digit changes, so the ones that stay the same don't move, and 09 to 10 rolls one step.
 */
export function createBand(section) {
  const band = section.querySelector('[data-work-band]');
  const label = section.querySelector('[data-work-band-label]')
  const index = section.querySelector('[data-work-index]');
  // A strip per digit, each item with the first state it shows (`data-from`, see WorkBand.astro)
  const digits = [...index.children];
  const titleWindow = section.querySelector('[data-work-titles]');
  const titleStrip = section.querySelector('[data-work-title-strip]');
  const titles = [...section.querySelectorAll('[data-work-title]')];
  let active = -1;
  let isRevealed = false;

  const measure = () => {
    // The band sticks at the bottom of the screen, the frame keeps room for it
    const bandHeight = band.offsetHeight;
    const labelHeight = label.offsetHeight
    band.style.top = `${document.documentElement.clientHeight - bandHeight}px`;
    section.style.setProperty('--band-height', `${labelHeight}px`);
    // Desktop: it starts over the column labels, at their distance from the top of the frame
    const frame = section.querySelector('[data-work-frame]');
    const columns = section.querySelector('[data-work-columns]');
    section.style.setProperty(
      '--band-offset',
      `${columns.getBoundingClientRect().top - frame.getBoundingClientRect().top}px`
    );

    // The titles all have the same size: the longest one takes the band's width (1px less, so the
    // window never cuts it), and none is taller than the index
    titles.forEach((title) => (title.style.fontSize = ''));
    const fontSize = parseFloat(getComputedStyle(titles[1] ?? titles[0]).fontSize);
    const widest = Math.max(...titles.map((title) => title.getBoundingClientRect().width));
    const highest = Math.max(...titles.map((title) => title.getBoundingClientRect().height));
    const scale = Math.min(
      (titleWindow.getBoundingClientRect().width - 1) / widest,
      index.parentElement.getBoundingClientRect().height / highest
    );
    titles.forEach((title) => (title.style.fontSize = `${fontSize * scale}px`));
    rollTo(active, false);
  };

  /**
   * Rolls the strips to a project, the title a little slower, its window taking its height.
   * `isAnimated` false: jumps there
   */
  const rollTo = (project, isAnimated) => {
    active = project;
    const title = titles[project + 1];
    const vars = { ease: 'power3.out', overwrite: true };
    digits.forEach((digit) => {
      const items = [...digit.children];
      const item = items.filter((digitItem) => Number(digitItem.dataset.from) <= project + 1).pop();
      const y = isRevealed ? -item.offsetTop : item.offsetHeight - item.offsetTop;
      gsap.to(digit, { y, ...vars, duration: isAnimated ? 0.6 : 0 });
    });
    gsap.to(titleStrip, { y: -title.offsetTop, ...vars, duration: isAnimated ? 0.8 : 0 });
    gsap.to(titleWindow, { height: title.offsetHeight, ...vars, duration: isAnimated ? 0.8 : 0 });
  };

  // Created after `rollTo`: when the page loads past the start (refresh mid-section), ScrollTrigger
  // calls onEnter right away, during create
  const reveal = (isShown) => {
    isRevealed = isShown;
    rollTo(active, true);
  };
  ScrollTrigger.create({
    trigger: section,
    start: 'top 30%',
    onEnter: () => reveal(true),
    onLeaveBack: () => reveal(false)
  });

  return { measure, rollTo };
}

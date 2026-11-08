/**
 * The widening center gutter of the layout grid (see grid.css): its two middle columns take the
 * extra width, so the items that end or start on the center gutter get it back as a margin, and
 * stay on their own column's edge.
 *
 * Each grid's items are measured once (and again on resize, the breakpoints move them): the ones
 * whose right edge is on the left of the center gutter, or the left edge on its right, are marked.
 * Called once from Layout.astro.
 */

// The grids following the layout grid: grid-layout-6/12 and the subgrids in them
const GRIDS = '[class*="grid-layout-"], .grid-cols-subgrid';

// Px of tolerance on an edge: the items 1px in from the grid lines (`mx-px`) count
const TOLERANCE = 2;

// While animating, how far around the screen the sections still follow, in screen heights
const SCOPE_MARGIN = 1;

// The elements following the center gutter in place of the whole page, while it animates
/** @type {HTMLElement[] | null} */
let scope = null;

/**
 * Sets how wide the center gutter is, in px, on the whole page. Under the gutter it stays the
 * gutter. Ends a scope (see scopeGridCenter)
 *
 * @param {number} width
 * @example
 * setGridCenter(portraitWidth);
 */
export function setGridCenter(width) {
  document.documentElement.style.setProperty('--grid-center', `${width}px`);
  scope?.forEach((element) => element.style.removeProperty('--grid-center'));
  scope = null;
}

/**
 * For an animation: from now on, setGridCenterFrame only moves the sections on or near the
 * screen (and the fixed grid lines), the rest of the page waits for the end (setGridCenter).
 * Every frame then relayouts a few grids instead of the whole page
 *
 * @param {number} width The current width, kept by the whole page meanwhile
 */
export function scopeGridCenter(width) {
  // A scope still open (ex: reversed midway): the whole page catches up first
  setGridCenter(width);

  const top = -window.innerHeight * SCOPE_MARGIN;
  const bottom = window.innerHeight * (1 + SCOPE_MARGIN);
  const main = document.querySelector('main');
  scope = [...document.body.children, ...(main?.children ?? [])].filter((element) => {
    if (!(element instanceof HTMLElement) || element === main || element.tagName === 'SCRIPT') return false;
    const rect = element.getBoundingClientRect();
    return rect.bottom > top && rect.top < bottom;
  });
}

/**
 * One frame of an animation: on the scope if one is open, the whole page otherwise
 *
 * @param {number} width
 */
export function setGridCenterFrame(width) {
  if (!scope) return setGridCenter(width);
  const value = `${width}px`;
  scope.forEach((element) => element.style.setProperty('--grid-center', value));
}

/** Marks the items on the center gutter of every grid, keeping their own margins */
function measure() {
  // Without the scrollbar, like the page
  const center = document.documentElement.clientWidth / 2;

  document.querySelectorAll(GRIDS).forEach((grid) => {
    const gridStyle = getComputedStyle(grid);
    const isGrid = gridStyle.display === 'grid' || gridStyle.display === 'inline-grid';
    const gutterHalf = (parseFloat(gridStyle.columnGap) || 0) / 2;

    for (const item of grid.children) {
      if (!(item instanceof HTMLElement)) continue;

      // Back to its own margins to measure it, then marked again or not
      item.style.marginLeft = item.dataset.gridMarginLeft ?? '';
      item.style.marginRight = item.dataset.gridMarginRight ?? '';
      delete item.dataset.gridMarginLeft;
      delete item.dataset.gridMarginRight;

      const style = getComputedStyle(item);
      if (!isGrid || style.display === 'none' || style.position === 'absolute' || style.position === 'fixed') continue;

      // Without the extra margin, an item on the center gutter has its edge on the gutter: the
      // middle columns reach it, whatever the extra
      const { left, right } = item.getBoundingClientRect();
      const isLeft = right <= center && right >= center - gutterHalf - TOLERANCE - parseFloat(style.marginRight);
      const isRight = left >= center && left <= center + gutterHalf + TOLERANCE + parseFloat(style.marginLeft);

      if (isLeft) {
        item.dataset.gridMarginRight = item.style.marginRight;
        item.style.marginRight = `calc(${style.marginRight} + var(--grid-extra) / 2)`;
      }
      if (isRight) {
        item.dataset.gridMarginLeft = item.style.marginLeft;
        item.style.marginLeft = `calc(${style.marginLeft} + var(--grid-extra) / 2)`;
      }
    }
  });
}

/**
 * Holds each section at its tallest, gutter closed or open: the media sized by their ratio make a
 * section shorter as its columns narrow. Held, nothing below moves while the gutter animates
 * (About doesn't slide up under Trials, the triggers stay put) and the page never changes height,
 * which stalls the browser far more than the layout itself (~80ms a frame, measured in Chrome)
 */
function holdHeights() {
  const root = document.documentElement;
  const sections = [...(document.querySelector('main')?.children ?? [])].filter(
    (element) => element instanceof HTMLElement && element.tagName !== 'SCRIPT'
  );
  const current = root.style.getPropertyValue('--grid-center');

  sections.forEach((section) => section.style.removeProperty('min-height'));
  const ends = ['0px', 'var(--grid-center-max)'].map((end) => {
    root.style.setProperty('--grid-center', end);
    return sections.map((section) => section.getBoundingClientRect().height);
  });

  if (current) root.style.setProperty('--grid-center', current);
  else root.style.removeProperty('--grid-center');
  sections.forEach((section, index) => {
    section.style.minHeight = `${Math.ceil(Math.max(ends[0][index], ends[1][index]))}px`;
  });
}

function update() {
  measure();
  holdHeights();
}

export function useGridCenter() {
  update();
  // The text rewraps in the web fonts: measured again once they're in
  document.fonts?.ready.then(update);

  let frame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  });
}

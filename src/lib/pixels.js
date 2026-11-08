import gsap from 'gsap';

/**
 * The media effect shared by Work, Trials and About: away from the action, the media are grey and
 * pixelated, they resolve to sharp and in color when it reaches them.
 *
 * Pixelated copies of the media: a canvas over each one, one canvas pixel per block, stretched
 * without smoothing. Each block is the average color of what it covers.
 *
 * Each media is drawn once, cropped like its object-cover, into a small copy and its halves
 * (`levels`): a block count is drawn from the smallest one still bigger, so it averages instead of
 * skipping pixels. A video is drawn again when its frame changes (it loads, pauses, seeks).
 */

// The color: quick to grey, smooth to color. Durations in seconds
export const MEDIA_COLOR_OUT_DURATION = 0.4;
export const MEDIA_COLOR_OUT_EASE = 'power2.in';
export const MEDIA_COLOR_IN_DURATION = 0.9;
export const MEDIA_COLOR_IN_EASE = 'sine.out';

// The pixels, more with the distance from the action: blocks of MEDIA_PIXEL_MIN px on it,
// MEDIA_PIXEL_MAX px from MEDIA_PIXEL_RANGE away (a share of the screen height), eased between
export const MEDIA_PIXEL_MIN = 6;
export const MEDIA_PIXEL_MAX = 18;
const MEDIA_PIXEL_RANGE = 0.8;
const easePixel = gsap.parseEase('power1.out');

// Width in px of the biggest copy: the most blocks a media can have across
const COPY_SIZE = 192;

/** The duration and ease of a turn to color (`isColor`) or to grey. `isAnimated` false: right away */
export const getColorTiming = (isColor, isAnimated) => ({
  duration: isAnimated ? (isColor ? MEDIA_COLOR_IN_DURATION : MEDIA_COLOR_OUT_DURATION) : 0,
  ease: isColor ? MEDIA_COLOR_IN_EASE : MEDIA_COLOR_OUT_EASE
});

/**
 * The block size of a media `distance` px from the action. `mix` resolves it: 1 pixelated, 0 sharp
 */
export const getPixelSize = (distance, mix) => {
  const share = easePixel(gsap.utils.clamp(0, 1, distance / (window.innerHeight * MEDIA_PIXEL_RANGE)));
  return mix * gsap.utils.interpolate(MEDIA_PIXEL_MIN, MEDIA_PIXEL_MAX, share);
};

/**
 * Adds a color switch to a timeline, at its "switch" label: `targets[active]` to color, the others
 * to grey (see getColorTiming). `getVars` gives the end state of each side
 *
 * @example
 * addColorSwitch(timeline, mixes, active, true, (isColor) => ({ value: isColor ? 0 : 1 }));
 */
export function addColorSwitch(timeline, targets, active, isAnimated, getVars) {
  [false, true].forEach((isColor) => {
    timeline.to(
      targets.filter((_, targetIndex) => (targetIndex === active) === isColor),
      { ...getVars(isColor), ...getColorTiming(isColor, isAnimated) },
      'switch'
    );
  });
}

const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
};

const isReady = (source) =>
  source instanceof HTMLVideoElement
    ? source.readyState >= 2 && source.videoWidth > 0
    : !!source && source.complete && source.naturalWidth > 0;

/** The copy and its halves, down to a few px, or none while the source isn't loaded */
const copySource = (pixel) => {
  const { source, item } = pixel;
  if (!isReady(source) || !source || !item.offsetHeight) return [];

  const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const sourceHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;

  // Cropped like object-cover in the media's box
  const boxRatio = item.offsetWidth / item.offsetHeight;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  if (sourceWidth / sourceHeight > boxRatio) cropWidth = sourceHeight * boxRatio;
  else cropHeight = sourceWidth / boxRatio;

  const copyWidth = boxRatio >= 1 ? COPY_SIZE : COPY_SIZE * boxRatio;
  const copyHeight = copyWidth / boxRatio;

  // Halved step by step from the source, a single big step would skip pixels
  let from = source;
  let x = (sourceWidth - cropWidth) / 2;
  let y = (sourceHeight - cropHeight) / 2;
  let width = cropWidth;
  let height = cropHeight;
  while (width / 2 > copyWidth) {
    const half = createCanvas(width / 2, height / 2);
    half.getContext('2d').drawImage(from, x, y, width, height, 0, 0, half.width, half.height);
    from = half;
    [x, y, width, height] = [0, 0, half.width, half.height];
  }

  const levels = [createCanvas(copyWidth, copyHeight)];
  levels[0].getContext('2d').drawImage(from, x, y, width, height, 0, 0, copyWidth, copyHeight);
  while (levels[levels.length - 1].width > 4) {
    const previous = levels[levels.length - 1];
    const half = createCanvas(previous.width / 2, previous.height / 2);
    half.getContext('2d').drawImage(previous, 0, 0, half.width, half.height);
    levels.push(half);
  }

  return levels;
};

export function createPixels(mediaItems) {
  const pixels = mediaItems.map((item) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      imageRendering: 'pixelated',
      pointerEvents: 'none',
      visibility: 'hidden'
    });
    item.append(canvas);

    return {
      item,
      source: item.querySelector('img, video'),
      canvas,
      context: canvas.getContext('2d'),
      levels: [],
      columns: 0,
      rows: 0,
      isShown: false,
      last: { size: 0, width: 0 }
    };
  });

  const show = (pixel, isShown) => {
    if (pixel.isShown === isShown) return;
    pixel.isShown = isShown;
    pixel.canvas.style.visibility = isShown ? 'visible' : 'hidden';
  };

  /**
   * Draws a media in blocks of `size` px, for its `width` on screen. Under 1.5px it's sharp: the
   * media itself shows
   */
  const draw = (itemIndex, size, width, force = false) => {
    const pixel = pixels[itemIndex];
    pixel.last = { size, width };
    if (size < 1.5) return show(pixel, false);

    if (!pixel.levels.length) pixel.levels = copySource(pixel);
    const [copy] = pixel.levels;
    if (!copy) return show(pixel, false);

    const columns = Math.min(copy.width, Math.max(1, Math.round(width / size)));
    const rows = Math.max(1, Math.round((columns * copy.height) / copy.width));
    if (!force && pixel.isShown && columns === pixel.columns && rows === pixel.rows) return;

    // The smallest copy still bigger than the blocks
    const from = [...pixel.levels].reverse().find((level) => level.width >= columns) ?? pixel.levels[0];
    pixel.columns = columns;
    pixel.rows = rows;
    pixel.canvas.width = columns;
    pixel.canvas.height = rows;
    pixel.context.imageSmoothingEnabled = true;
    pixel.context.imageSmoothingQuality = 'high';
    pixel.context.drawImage(from, 0, 0, columns, rows);
    show(pixel, true);
  };

  // A new image or video frame: copy it again
  const listeners = pixels.map((pixel, itemIndex) => {
    const redraw = () => {
      pixel.levels = [];
      draw(itemIndex, pixel.last.size, pixel.last.width, true);
    };
    const events = pixel.source instanceof HTMLVideoElement ? ['loadeddata', 'pause', 'seeked'] : ['load'];
    events.forEach((event) => pixel.source?.addEventListener(event, redraw));
    return () => events.forEach((event) => pixel.source?.removeEventListener(event, redraw));
  });

  /** After a resize, the boxes changed: copy every media again on the next draw */
  const reset = () =>
    pixels.forEach((pixel) => {
      pixel.levels = [];
      pixel.columns = 0;
    });

  /** Removes the canvases and listeners, the media show as they are */
  const destroy = () => {
    listeners.forEach((removeListeners) => removeListeners());
    pixels.forEach((pixel) => pixel.canvas.remove());
  };

  return { draw, reset, destroy };
}

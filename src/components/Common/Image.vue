<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<script setup>
import { computed } from 'vue';
import { isVideo, resolveImage } from '@/lib/image';

/**
 * Image with a fixed ratio box and a placeholder color while it loads
 * `image` accepts every format of src/data (see resolveImage in src/lib/image.js)
 * A video file (.mp4, .webm, .mov) plays muted and looped, like a gif. Give it an `ar`: its size
 * isn't known until it loads
 *
 * @example
 * <Image :image="project.cover" ar="4/3" />
 * <Image image="/projects/alpha.svg" alt="Alpha homepage" ar="16/9" rounded />
 * <Image :image="portrait" class="absolute inset-0" /> // the parent sets the size
 * <Image image="/projects/alpha-loop.mp4" alt="Alpha homepage scrolling" ar="16/9" />
 */

const props = defineProps({
  /** A url string, an imported file, or `{ src, alt }` */
  image: { type: [String, Object], required: true },

  /** Alternative text, overrides the one in `image`. Leave empty for decorative images */
  alt: String,

  /** Ratio of the box, ex: `16/9`, `4/5`. Without it, the image keeps its own ratio */
  ar: String,

  rounded: Boolean,

  /** `eager` for images visible on load (the hero), `lazy` for the rest */
  loading: { type: String, default: 'lazy' },

  /**
   * Makes it open full size in the media viewer (UI/MediaViewer.astro) on click, with this as its
   * accessible name, followed by the alt. The viewer flips through the media of the same
   * `[data-media-group]` parent
   */
  viewLabel: String
});

const resolved = computed(() => resolveImage(props.image));
const altText = computed(() => props.alt ?? resolved.value?.alt);
const viewName = computed(() => [props.viewLabel, altText.value].filter(Boolean).join(', '));
</script>

<template>
  <div
    class="relative overflow-hidden"
    :class="{ 'rounded-xs': rounded }"
    :style="ar ? { aspectRatio: ar } : undefined"
  >
    <!-- A muted loop, like a gif: no controls, plays inline on phones -->
    <video
      v-if="resolved && isVideo(resolved.src)"
      :src="resolved.src"
      :aria-label="altText || undefined"
      :aria-hidden="altText ? undefined : 'true'"
      autoplay
      muted
      loop
      playsinline
      disablepictureinpicture
      preload="metadata"
      class="block size-full object-cover"
      :class="{ 'absolute inset-0': ar }"
    />
    <img
      v-else-if="resolved"
      :src="resolved.src"
      :width="resolved.width"
      :height="resolved.height"
      :alt="altText ?? ''"
      :loading="loading"
      decoding="async"
      class="block size-full object-cover"
      :class="{ 'absolute inset-0': ar }"
    />
    <!-- Over the media and its pixelated canvas (src/lib/pixels.js) -->
    <button
      v-if="viewLabel && resolved"
      type="button"
      :aria-label="viewName"
      :data-src="resolved.src"
      :data-alt="altText"
      data-media-view
      class="absolute inset-0 z-1 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
    />
  </div>
</template>

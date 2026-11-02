<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<script setup>
import { computed } from 'vue';
import { resolveImage } from '@/lib/image';

/**
 * Image with a fixed ratio box and a placeholder color while it loads
 * `image` accepts every format of src/data (see resolveImage in src/lib/image.js)
 *
 * @example
 * <Image :image="project.cover" ar="4/3" />
 * <Image image="/projects/alpha.svg" alt="Alpha homepage" ar="16/9" rounded />
 * <Image :image="portrait" class="absolute inset-0" /> // the parent sets the size
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
  loading: { type: String, default: 'lazy' }
});

const resolved = computed(() => resolveImage(props.image));
</script>

<template>
  <div
    class="bg-placeholder relative overflow-hidden"
    :class="{ 'rounded-xs': rounded }"
    :style="ar ? { aspectRatio: ar } : undefined"
  >
    <img
      v-if="resolved"
      :src="resolved.src"
      :width="resolved.width"
      :height="resolved.height"
      :alt="alt ?? resolved.alt ?? ''"
      :loading="loading"
      decoding="async"
      class="block size-full object-cover"
      :class="{ 'absolute inset-0': ar }"
    />
  </div>
</template>

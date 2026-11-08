<script setup>
import { computed } from 'vue';

/**
 * Inlines an svg from `src/assets/icons` by its filename, ex: <Icon name="arrow" />
 *
 * Icons are sized to 1em by default so they follow the font size, override with a size class.
 * Draw them with `currentColor` so they follow the text color.
 */

const ICONS = Object.fromEntries(
  Object.entries(import.meta.glob('/src/assets/icons/*.svg', { query: '?raw', import: 'default', eager: true })).map(
    ([path, svg]) => [path.split('/').pop().replace('.svg', ''), svg]
  )
);

const props = defineProps({
  /** Filename of the svg without the extension */
  name: { type: String, required: true }
});

const svg = computed(() => {
  if (!ICONS[props.name] && import.meta.env.DEV) {
    console.warn(`[Icon] "${props.name}" not found in src/assets/icons`);
  }

  return ICONS[props.name] ?? '';
});
</script>

<template>
  <span class="inline-block size-[1em] shrink-0 leading-0 [&>svg]:size-full" aria-hidden="true" v-html="svg" />
</template>

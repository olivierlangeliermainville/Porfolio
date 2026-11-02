<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<script setup>
import { interactiveTagProps, useInteractiveTag } from '@/composables/useInteractiveTag';

/**
 * Unstyled wrapper that becomes an <a/> when given a `to`, a <div/> otherwise
 * Useful for cards that are only sometimes linked
 *
 * @example
 * <MaybeLink :to="project.link" class="block">...</MaybeLink>
 */

const props = defineProps({
  ...interactiveTagProps,

  /** Screen reader hint appended to links opening in a new window */
  newWindowLabel: { type: String, default: '(opens in a new window)' }
});

const { tag, props: tagProps, opensNewWindow } = useInteractiveTag({
  to: () => props.to,
  overrideTag: () => props.overrideTag,
  disabled: () => props.disabled,
  newWindow: () => props.newWindow,
  defaultTag: 'div'
});
</script>

<template>
  <component
    :is="tag"
    v-bind="tagProps"
  >
    <slot />
    <span
      v-if="opensNewWindow"
      class="sr-only"
    >
      {{ newWindowLabel }}
    </span>
  </component>
</template>

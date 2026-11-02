<script>
import { defineComponent } from 'vue';

// Each type carries its own look
const TYPE_CLASS = {
  // Filled, main action
  primary: 'rounded-full bg-primary px-s py-xs text-on-primary hover-enabled:bg-primary-hover',
  // Outlined, secondary action
  secondary: 'rounded-full border border-current px-s py-xs hover-enabled:bg-foreground hover-enabled:text-background',
  // Accent color, for the one action that must stand out (ex: contact)
  accent: 'rounded-full bg-accent px-s py-xs text-on-accent hover-enabled:opacity-85',
  // Text link with an underline that grows on hover
  link: 'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] hover-enabled:bg-[length:100%_1px]'
};

const WIDTH_CLASS = {
  auto: '',
  full: 'w-full',
  // Icon only buttons, pair with `label`
  square: 'aspect-square size-11 p-0! [&_.icon]:size-5!'
};

export default defineComponent({});
</script>

<script setup>
import { useSlots } from 'vue';
import { interactiveTagProps, useInteractiveTag } from '@/composables/useInteractiveTag';
import { hasSlotContent } from '@/lib/hasSlotContent';
import Icon from './Icon.vue';
import Text from './Text.vue';

/**
 * Renders an <a/> when given a `to`, a <button/> otherwise
 *
 * @example
 * <Button text="See my work" to="#work" icon-right="arrow" />
 * <Button button-type="secondary" text="Resume" to="/resume.pdf" />
 * <Button button-type="link" text="Visit site" to="https://example.com" icon-right="external" />
 * <Button width="square" icon-left="close" label="Close" @click="close" />
 */

const props = defineProps({
  ...interactiveTagProps,

  /** Text rendered through <Text/>, the default slot can be used instead */
  text: String,

  /** Accessible name, required for icon only buttons */
  label: String,

  /** Name of an icon in src/assets/icons rendered before the text */
  iconLeft: String,

  /** Name of an icon in src/assets/icons rendered after the text */
  iconRight: String,

  buttonType: { type: String, default: 'primary', validator: (value) => value in TYPE_CLASS },

  width: { type: String, default: 'auto', validator: (value) => value in WIDTH_CLASS },

  /** Looks like a button but doesn't act like one (no hover, no pointer), ex: nested in a card link */
  isInert: Boolean,

  /** Screen reader hint appended to links opening in a new window */
  newWindowLabel: { type: String, default: '(opens in a new window)' }
});

const slots = useSlots();

const { tag, props: tagProps, opensNewWindow } = useInteractiveTag({
  to: () => props.to,
  overrideTag: () => props.overrideTag,
  disabled: () => props.disabled,
  newWindow: () => props.newWindow
});
</script>

<template>
  <component
    :is="tag"
    v-bind="tagProps"
    :aria-label="label"
    :data-inert="isInert || undefined"
    class="group/button inline-flex items-center justify-center gap-xxs transition-colors duration-(--duration-fast) disabled:opacity-50"
    :class="[WIDTH_CLASS[width], TYPE_CLASS[buttonType], disabled || isInert ? 'cursor-default' : 'cursor-pointer']"
  >
    <Icon
      v-if="iconLeft"
      :name="iconLeft"
      class="icon size-[1.15em]"
    />

    <Text
      v-if="text"
      size="button"
      :text="text"
    />
    <Text
      v-else-if="hasSlotContent(slots.default?.())"
      size="button"
    >
      <slot />
    </Text>

    <Icon
      v-if="iconRight"
      :name="iconRight"
      class="icon size-[1.15em] transition-transform duration-(--duration-default) ease-standard group-hover/button:translate-x-0.5"
    />

    <span
      v-if="opensNewWindow"
      class="sr-only"
    >
      {{ newWindowLabel }}
    </span>
  </component>
</template>

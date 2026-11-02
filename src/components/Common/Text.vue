<script>
import { defineComponent } from 'vue';

const SIZE_CLASS = {
  'heading-1': 'text-heading-1 font-primary',
  'heading-2': 'text-heading-2 font-primary',
  'heading-3': 'text-heading-3 font-primary',
  'body-1': 'text-body-1 font-secondary',
  'body-2': 'text-body-2 font-secondary',
  label: 'text-label font-secondary uppercase',
  button: 'text-button font-secondary'
};

/** Rich text defaults, Tailwind preflight strips them all */
const HTML_CLASS = [
  '[&>*+*]:mt-[1em]',
  '[&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity hover:[&_a]:opacity-70',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-[1.25em] [&_ol]:pl-[1.25em]',
  '[&_strong]:font-semibold [&_em]:italic'
];

// No options, but Astro's editor tooling reads this block as the module: without it,
// `import Text from './Text.vue'` in .astro files shows a false "no default export" error
export default defineComponent({});
</script>

<script setup>
import { computed, h } from 'vue';

/**
 * Renders a string with one of the type scale sizes (see src/styles/fonts.css)
 *
 * @example
 * <Text tag-name="h1" size="heading-1" text="Hello" />
 * <Text tag-name="div" size="body-1" :text="project.description" html />
 */

const props = defineProps({
  /** The string to render, the default slot can be used instead */
  text: String,

  /** The root element, ex: `h1`, `p`, `div` (use `div` for html containing paragraphs) */
  tagName: { type: String, default: 'span' },

  /** Render `text` as html, ex: `'Built with <strong>Astro</strong>'` */
  html: Boolean,

  /** One of the type scale sizes */
  size: { type: String, default: 'body-1', validator: (value) => value in SIZE_CLASS }
});

// `v-html` on a dynamic <component/> is dropped during SSR, a render function isn't
const HtmlTag = (props) => h(props.tag, { innerHTML: props.content });
HtmlTag.props = ['tag', 'content'];

// Plain multi-line strings keep their line breaks
const htmlText = computed(() => {
  const text = props.text ?? '';

  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  return text.replace(/\r\n|\n|\r/g, '<br>');
});
</script>

<template>
  <HtmlTag
    v-if="html"
    :tag="tagName"
    :content="htmlText"
    :class="[SIZE_CLASS[size], HTML_CLASS]"
  />
  <component
    :is="tagName"
    v-else
    :class="SIZE_CLASS[size]"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

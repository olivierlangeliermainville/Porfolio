import { computed, toValue } from 'vue';
import { isExternalLink } from '@/lib/url';

/** Props to spread in `defineProps` of components that use this composable */
export const interactiveTagProps = {
  // A possible href, internal (`/#work`) or external (`https://`, `mailto:`, `tel:`)
  to: String,
  // Force a tag, ex: a `span` when nested inside another interactive element
  overrideTag: String,
  // Passed back as the `disabled` attribute when rendered as a button
  disabled: Boolean,
  // Force opening (or not) in a new window, defaults to true for external links (not mailto/tel)
  newWindow: { type: Boolean, default: undefined }
};

/**
 * Determines whether the underlying interactive element should be an <a/>, a <button/> or something else
 *
 * Accepts props, refs, getters or plain values
 */
export function useInteractiveTag(options) {
  const to = computed(() => toValue(options.to));
  const overrideTag = computed(() => toValue(options.overrideTag));
  const defaultTag = computed(() => toValue(options.defaultTag) ?? 'button');
  const disabled = computed(() => toValue(options.disabled));

  const opensNewWindow = computed(() => {
    if (overrideTag.value || !to.value) return false;

    return toValue(options.newWindow) ?? (isExternalLink(to.value) && !/^(mailto|tel):/i.test(to.value));
  });

  const tag = computed(() => {
    if (overrideTag.value) return overrideTag.value;

    // A disabled link can't be navigated to, so it's rendered as a disabled button
    if (to.value && !disabled.value) return 'a';

    return defaultTag.value;
  });

  const props = computed(() => {
    if (overrideTag.value) return {};

    if (tag.value === 'a') {
      return {
        href: to.value,
        ...(opensNewWindow.value ? { target: '_blank', rel: 'noopener noreferrer' } : {})
      };
    }

    if (tag.value === 'button') {
      return { type: 'button', disabled: disabled.value || undefined };
    }

    return {};
  });

  return { tag, props, opensNewWindow };
}

<script setup>
/**
 * Small pill, ex: a project's tags or role. Pass `active` for a selected state (filters).
 *
 * @example
 * <Tag text="Branding" />
 * <Tag as="button" text="All" :active="true" @click="..." />
 */
defineProps({
  text: { type: String, required: true },
  /** Root element, `button` for filters */
  as: { type: String, default: 'span' },
  active: Boolean
});
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :aria-pressed="as === 'button' ? active : undefined"
    class="text-label inline-flex items-center rounded-full border px-xs py-xxs uppercase transition-colors duration-(--duration-fast)"
    :class="[
      active ? 'border-foreground bg-foreground text-background' : 'border-border',
      as === 'button' && !active ? 'cursor-pointer hover-enabled:border-foreground' : ''
    ]"
  >
    {{ text }}
  </component>
</template>

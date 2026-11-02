<script setup>
import Icon from '@/components/Common/Icon.vue';
import Image from '@/components/Common/Image.vue';
import MaybeLink from '@/components/Common/MaybeLink.vue';
import Tag from '@/components/Common/Tag.vue';
import Text from '@/components/Common/Text.vue';

/**
 * One project of src/data/projects.js: cover, title, year, client, description and tags
 * The whole card is a link when the project has a `to`
 */

defineProps({
  project: { type: Object, required: true },
  /** Full width card with a wider cover */
  large: Boolean,
  /** Loads the cover right away (first card, likely above the fold) */
  eager: Boolean
});
</script>

<template>
  <MaybeLink
    :to="project.to"
    class="group flex flex-col gap-xs"
  >
    <div class="overflow-hidden rounded-xs">
      <Image
        :image="project.cover"
        :ar="large ? '21/9' : '4/3'"
        :loading="eager ? 'eager' : 'lazy'"
        class="transition-transform duration-(--duration-slow) ease-standard group-hover:scale-[1.03]"
      />
    </div>

    <div class="flex items-start justify-between gap-xs">
      <div class="flex flex-col gap-xxxs">
        <Text
          tag-name="h3"
          size="heading-3"
          class="flex items-center gap-xxs"
        >
          {{ project.title }}
          <Icon
            v-if="project.to"
            name="arrow"
            class="size-[0.6em] -rotate-45 opacity-0 transition-[opacity,translate] duration-(--duration-default) group-hover:translate-x-1 group-hover:opacity-100"
          />
        </Text>
        <Text
          v-if="project.client"
          size="body-2"
          class="text-muted"
          :text="project.client"
        />
      </div>
      <Text
        size="label"
        class="text-muted pt-xxs"
        :text="String(project.year)"
      />
    </div>

    <Text
      v-if="project.description"
      tag-name="p"
      size="body-2"
      html
      class="text-muted max-w-[52ch]"
      :text="project.description"
    />

    <div
      v-if="project.tags?.length"
      class="flex flex-wrap gap-xxxs"
    >
      <Tag
        v-for="tag in project.tags"
        :key="tag"
        :text="tag"
      />
    </div>
  </MaybeLink>
</template>

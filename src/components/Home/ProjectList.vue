<script setup>
import { computed, ref } from 'vue';
import Tag from '@/components/Common/Tag.vue';
import ProjectCard from './ProjectCard.vue';

/**
 * The projects of src/data/projects.js in a grid, filtered by tag
 * The filter only shows when the projects have at least two tags in total
 */

const props = defineProps({
  projects: { type: Array, required: true }
});

const ALL = 'All';

const tags = computed(() => [...new Set(props.projects.flatMap((project) => project.tags ?? []))]);
const activeTag = ref(ALL);

const visibleProjects = computed(() =>
  activeTag.value === ALL ? props.projects : props.projects.filter((project) => project.tags?.includes(activeTag.value))
);
</script>

<template>
  <div>
    <div
      v-if="tags.length > 1"
      class="mb-m flex flex-wrap gap-xxs"
      role="group"
      aria-label="Filter projects"
    >
      <Tag
        v-for="tag in [ALL, ...tags]"
        :key="tag"
        as="button"
        :text="tag"
        :active="activeTag === tag"
        @click="activeTag = tag"
      />
    </div>

    <TransitionGroup
      tag="ul"
      class="grid-layout-1 gap-y-l md:grid-layout-2 md:gap-y-xl"
      enter-active-class="transition-[opacity,translate] duration-(--duration-slow) ease-standard"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="hidden"
    >
      <li
        v-for="(project, index) in visibleProjects"
        :key="project.title"
        :class="{ 'md:col-span-2': project.featured && activeTag === ALL }"
      >
        <ProjectCard
          :project="project"
          :large="project.featured && activeTag === ALL"
          :eager="index === 0"
        />
      </li>
    </TransitionGroup>

    <p
      v-if="!visibleProjects.length"
      class="text-muted"
    >
      No projects with this tag yet.
    </p>
  </div>
</template>

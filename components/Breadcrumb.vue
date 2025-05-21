<template>
  <nav
    class="text-sm text-gray-500 dark:text-gray-400 mb-4"
    aria-label="Breadcrumb"
  >
    <ol class="list-reset flex flex-wrap items-center">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-gray-700 dark:text-gray-300 font-semibold">
          {{ item.label }}
        </span>
        <span v-if="index < items.length - 1" class="mx-2">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: { label: string; to: string | null }[];
}>();
</script>

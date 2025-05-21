<template>
  <LayoutDefault>
    <div
      v-if="project"
      class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6 dark:bg-gray-900 dark:text-gray-100"
    >
      <!-- Header du projet -->
      <div class="border-b pb-4">
        <h1 class="text-4xl font-bold mb-2">{{ project.title }}</h1>
        <div
          class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <span
            >🎨 Theme: <strong>{{ project.theme }}</strong></span
          >
          <span
            >🛠 Tech: <strong>{{ project.tech }}</strong></span
          >
          <span
            >🚀 Deploy: <strong>{{ project.deploy }}</strong></span
          >
          <span
            >📅 Created:
            <strong>{{ formatDate(project.createdAt) }}</strong></span
          >
          <span
            >Status:
            <span :class="statusClass">{{ project.status }}</span></span
          >
        </div>
      </div>

      <!-- Liens rapides -->
      <div class="flex flex-wrap gap-4 my-6">
        <div class="flex flex-wrap gap-4 my-6">
          <NuxtLink
            :to="`/project/${cleanSlug}/blueprints`"
            class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-semibold"
          >
            🔧 Voir les Blueprints
          </NuxtLink>
          <NuxtLink
            :to="`/project/${cleanSlug}/context`"
            class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm font-semibold"
          >
            🧠 Voir les Contexts
          </NuxtLink>
          <NuxtLink
            :to="`/project/${cleanSlug}/tickets`"
            class="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm font-semibold"
          >
            📋 Voir les Tickets
          </NuxtLink>
        </div>
      </div>

      <!-- Contenu Markdown -->
      <div class="prose max-w-none">
        <ContentRenderer :value="project" />
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { formatDate } from "@/utils/helpers";

const route = useRoute();

const cleanSlug = computed(() =>
  route.params.slug.replace(".md", "").replace(".markdown", "")
);

const { data: project } = await useAsyncData(`project-${cleanSlug.value}`, () =>
  queryCollection("projects")
    .path(`/projects/${cleanSlug.value}/${cleanSlug.value}`)
    .first()
);

const statusClass = computed(() => {
  if (!project.value?.status) return "";
  switch (project.value.status) {
    case "bootstrap-ready":
      return "text-green-600 font-bold";
    case "in-progress":
      return "text-blue-500 font-bold";
    case "completed":
      return "text-purple-600 font-bold";
    default:
      return "text-gray-500 font-semibold";
  }
});
</script>

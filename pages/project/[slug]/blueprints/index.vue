<template>
  <LayoutDefault>
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <Breadcrumb :items="breadcrumbItems" />
      <h1 class="text-2xl font-bold mb-4">🔧 Blueprints du projet</h1>

      <div v-if="blueprints?.length" class="space-y-4">
        <NuxtLink
          v-for="file in blueprints"
          :key="file._path"
          :to="`/project/${slug}/blueprints/${file.id
            .split('/')
            .pop()
            .replace('.md', '')}`"
          class="block p-4 border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <h2 class="text-xl font-semibold">{{ file.title || file._file }}</h2>
          <p class="text-gray-500 text-sm">
            {{ file.description || "Pas de description." }}
          </p>
        </NuxtLink>
      </div>

      <div v-else class="text-gray-500">
        Aucun blueprint disponible pour ce projet.
      </div>
    </div></LayoutDefault
  >
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

const breadcrumbItems = useBreadcrumb();
const route = useRoute();
const slug = route.params.slug;

const { data: blueprints } = await useAsyncData(`blueprints-${slug}`, () =>
  queryCollection("projects")
    .where("type", "=", "blueprint")
    .where("slug", "=", slug)
    .all()
);
</script>

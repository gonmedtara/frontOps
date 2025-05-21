<template>
  <LayoutDefault>
    <div
      v-if="contextFile"
      class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow dark:bg-gray-900 dark:text-white"
    >
      <Breadcrumb :items="breadcrumbItems" />
      <h1 class="text-2xl font-bold mb-4">
        🔧 {{ contextFile.title || "Context" }}
      </h1>
      <div class="prose max-w-none">
        <ContentRenderer :value="contextFile" />
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

const breadcrumbItems = useBreadcrumb();
const route = useRoute();

const { data: contextFile } = await useAsyncData(
  `context-${route.params.slug}-${route.params.file}`,
  () =>
    queryCollection("projects")
      .path(`/projects/${route.params.slug}/context/${route.params.file}`)
      .first()
);

console.log(contextFile);
</script>

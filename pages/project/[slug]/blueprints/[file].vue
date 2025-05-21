<template>
  <LayoutDefault>
    <div
      v-if="blueprint"
      class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow dark:bg-gray-900 dark:text-white"
    >
      <Breadcrumb :items="breadcrumbItems" />
      <h1 class="text-2xl font-bold mb-4">
        🔧 {{ blueprint.title || "Blueprint" }}
      </h1>
      <div class="prose max-w-none">
        <ContentRenderer :value="blueprint" />
      </div>
    </div>
    ></LayoutDefault
  >
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

const breadcrumbItems = useBreadcrumb();
const route = useRoute();

const { data: blueprint } = await useAsyncData(
  `blueprint-${route.params.slug}-${route.params.file}`,
  () =>
    queryCollection("projects")
      .path(`/projects/${route.params.slug}/blueprints/${route.params.file}`)
      .first()
);
</script>

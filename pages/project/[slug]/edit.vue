<template>
  <LayoutDefault>
    <div v-if="project" class="max-w-xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">✏️ Edit Project Description</h2>
      <textarea v-model="content" class="textarea w-full" rows="10" />
      <button @click="save" class="btn btn-success mt-4">💾 Save</button>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
//import { useProjectStore } from "@/stores/projectStore";

const route = useRoute();
const router = useRouter();
const store = useProjectStore();

//await store.loadProject(route.params.slug);
const project = store.project;
const content = ref(project?.body || "");

const save = async () => {
  await $fetch("/api/update-project-description", {
    method: "POST",
    body: { slug: route.params.slug, body: content.value },
  });
  router.push(`/project/${route.params.slug}`);
};
</script>

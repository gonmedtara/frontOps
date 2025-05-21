<template>
  <div v-html="compiled" class="prose max-w-none"></div>
</template>

<script setup lang="ts">
import { marked } from "marked";
import { ref, watch } from "vue";

const props = defineProps<{ content: string }>();
const compiled = ref("");

watch(
  () => props.content,
  (md) => {
    if (md) compiled.value = marked.parse(md);
  },
  { immediate: true }
);
</script>

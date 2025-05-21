<template>
  <LayoutDefault>
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <h2 class="text-xl font-bold mb-2">👨‍💻 Developer Agent</h2>
        <AiPromptTab :role="AI_ROLES.DEV" />
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-bold mb-2">📋 Product Owner Agent</h2>
        <AiPromptTab :role="AI_ROLES.PO" />
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup>
import AiPromptTab from "@/components/AiPromptTab.vue";
import LayoutDefault from "@/components/LayoutDefault.vue";
import { AI_ROLES } from "@/ai/roles";
</script>

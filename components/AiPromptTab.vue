<template>
  <div class="p-4 space-y-4 bg-white rounded-xl shadow">
    <h2 class="text-lg font-semibold">AI Prompt</h2>
    <textarea
      v-model="prompt"
      class="w-full p-2 border rounded-md"
      rows="6"
      placeholder="Enter your prompt here..."
    />
    <div class="flex gap-2 items-center mb-2">
      <label for="role" class="text-sm font-medium">Role:</label>
      <select v-model="selectedRole" id="role" class="border px-2 py-1 rounded">
        <option v-for="role in roles" :key="role" :value="role">
          {{ role }}
        </option>
      </select>
    </div>
    <button
      @click="submit"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Submit
    </button>
    <MarkdownViewer v-if="response" :content="response" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { callAI } from "@/ai/callAI";
import { AI_ROLES, TECHNICAL_CONFIGS } from "@/ai/roles";
import MarkdownViewer from "./MarkdownViewer.vue";

const roles = Object.keys(AI_ROLES);
const selectedRole = ref("DEV");
const prompt = ref("");
const response = ref("");

const submit = async () => {
  const result = await callAI({
    systemPrompt: `${AI_ROLES[selectedRole.value]}${TECHNICAL_CONFIGS.join(
      "."
    )}`,
    userPrompt: prompt.value,
  });
  response.value = result || "No response";
};
</script>

<template>
  <div class="p-4 border rounded shadow hover:shadow-md transition">
    <h3 class="font-bold">{{ ticket.title }}</h3>
    <p class="text-sm text-gray-600">Status: {{ ticket.status }}</p>
    <NuxtLink
      :to="`${ticket.path.replace('tickets', 'ticket')}`"
      class="text-blue-600 hover:underline"
      >View</NuxtLink
    >
  </div>
</template>

<script setup>
defineProps(["ticket"]);
</script>

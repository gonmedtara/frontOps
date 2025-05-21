<!-- <template>
  <LayoutDefault>
    <h1 class="text-2xl font-bold mb-4">📋 Tickets</h1>
    <div v-if="tickets?.length" class="grid md:grid-cols-2 gap-4">
      <TicketCard
        v-for="ticket in tickets"
        :key="ticket._path"
        :ticket="ticket"
      />
    </div>
    <div v-else class="text-red-600">Aucun ticket trouvé 😢</div>
  </LayoutDefault>
</template>

<script setup>
import TicketCard from "@/components/TicketCard.vue";
import LayoutDefault from "@/components/LayoutDefault.vue";

const { data: tickets } = await useAsyncData("all-tickets", () =>
  queryCollection("tickets").all()
);
</script> -->

<template>
  <LayoutDefault>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">👋 Welcome to FrontOps</h1>
      <NuxtLink to="/project/new" class="btn btn-primary"
        >➕ New Project</NuxtLink
      >
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard
        v-for="project in projects"
        :key="project.path"
        :project="project"
      />
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import LayoutDefault from "@/components/LayoutDefault.vue";
import ProjectCard from "@/components/ProjectCard.vue";

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").where("type", "=", "project").all()
);
</script>

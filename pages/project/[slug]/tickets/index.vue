<template>
  <LayoutDefault>
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <Breadcrumb :items="breadcrumbItems" />
      <h1 class="text-2xl font-bold mb-4">📋 Tickets du projet</h1>

      <div v-if="tickets?.length" class="space-y-4">
        <NuxtLink
          v-for="ticket in tickets"
          :key="ticket._path"
          :to="`/project/${slug}/tickets/${ticket.meta.ticket_id
            ? ticket.meta.ticket_id.toLowerCase()
            : ticket._file.replace('.md', '')
          }`"
          class="block p-4 border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <div class="flex items-center gap-3 mb-2">
             <span class="text-sm font-medium" 
               :class="{
                 'text-blue-600 dark:text-blue-400': ticket.meta.ticket_type === 'feature',
                 'text-red-600 dark:text-red-400': ticket.meta.ticket_type === 'bug',
                 'text-green-600 dark:text-green-400': ticket.meta.ticket_type === 'enhancement'
               }">
               {{ ticket.meta.ticket_type }}
             </span>
             <span class="text-sm font-medium" 
               :class="{
                 'text-red-600 dark:text-red-400': ticket.meta.priority === 'high',
                 'text-yellow-600 dark:text-yellow-400': ticket.meta.priority === 'medium',
                 'text-gray-600 dark:text-gray-400': ticket.meta.priority === 'low'
               }">
               {{ ticket.meta.priority }}
             </span>
             <span class="text-sm text-purple-600 dark:text-purple-400">
               {{ ticket.meta.story_points }} SP
             </span>
             <span class="text-sm" 
               :class="{
                  'text-green-600 dark:text-green-400': ticket.status === 'open',
                  'text-gray-600 dark:text-gray-400': ticket.status === 'closed',
                  'text-yellow-600 dark:text-yellow-400': ticket.status === 'in progress'
                }">
                {{ ticket.status }}
              </span>
             <span class="text-sm text-gray-500 dark:text-gray-400 ml-auto">
               {{ ticket.meta.ticket_id }}
             </span>
           </div>

          <h2 class="text-xl font-semibold mb-2">
            {{ ticket.title || ticket._file }}
          </h2>
          
          <!-- Display Labels -->
          <div v-if="ticket.meta.labels && ticket.meta.labels.length > 0" class="flex flex-wrap gap-1 mb-2">
            <span v-for="(label, index) in ticket.meta.labels" :key="index"
                class="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ label }}
            </span>
          </div>

          <p class="text-gray-500 text-sm">
            {{ ticket.meta.short_description || "Pas de description." }}
          </p>
        </NuxtLink>
      </div>

      <div v-else class="text-gray-500">
        Aucun ticket disponible pour ce projet.
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

const breadcrumbItems = useBreadcrumb();
const route = useRoute();
const slug = route.params.slug;

const { data: tickets } = await useAsyncData(`tickets-${slug}`, () =>
  queryCollection("projects")
    .where("type", "=", "ticket")
    .where("slug", "=", slug)
    .all()
);
</script>

<template>
  <LayoutDefault>
    <div
      v-if="ticket"
      class="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow dark:bg-gray-900 dark:text-white"
    >
      <Breadcrumb :items="breadcrumbItems" />
      
      <div class="mt-6 space-y-8">
        <!-- En-tête du ticket -->
        <div class="border-b pb-6 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="text-sm font-medium px-3 py-1 rounded-full" 
              :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': ticket.meta.ticket_type === 'feature',
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': ticket.meta.ticket_type === 'bug',
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': ticket.meta.ticket_type === 'enhancement'
              }">
              {{ ticket.meta.ticket_type }}
            </span>
            <span class="text-sm font-medium px-3 py-1 rounded-full"
              :class="{
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': ticket.meta.priority === 'high',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': ticket.meta.priority === 'medium',
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': ticket.meta.priority === 'low'
              }">
              {{ ticket.meta.priority }}
            </span>
            <span class="text-sm font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {{ ticket.meta.story_points }} SP
            </span>
             <span class="text-sm font-medium px-3 py-1 rounded-full"
              :class="{
                 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': ticket.status === 'open',
                 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': ticket.status === 'closed',
                 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': ticket.status === 'in progress'
               }">
               {{ ticket.status }}
             </span>
            <span class="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {{ ticket.meta.ticket_id }}
            </span>
          </div>

           <!-- Labels -->
           <div v-if="ticket.labels && ticket.labels.length > 0" class="flex flex-wrap gap-2 mb-4">
             <span v-for="(label, index) in ticket.labels" :key="index"
                 class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                 {{ label }}
             </span>
           </div>

          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ ticket.title }}
          </h1>
        </div>

        <!-- Contenu du ticket -->
        <div class="prose dark:prose-invert max-w-none space-y-8">
          <!-- Use ContentRenderer to render the markdown body -->
          <ContentRenderer :value="ticket" />
        </div>
      </div>
    </div>

    <div v-else class="max-w-4xl mx-auto p-8 text-center">
      <p class="text-lg text-gray-500 dark:text-gray-400">Ticket non trouvé.</p>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

const breadcrumbItems = useBreadcrumb();
const route = useRoute();

const { data: ticket } = await useAsyncData(
  `ticket-${route.params.slug}-${route.params.ticket}`,
  () =>
    queryCollection("projects")
      .path(`/projects/${route.params.slug}/tickets/${route.params.ticket}`)
      .first()
);

</script>

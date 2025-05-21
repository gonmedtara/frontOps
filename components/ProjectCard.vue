<template>
  <div class="p-4 border rounded shadow bg-white dark:bg-gray-900">
    <h3 class="text-lg font-bold mb-1">{{ project.title }}</h3>
    <p class="text-sm text-gray-600 mb-2">Tech: {{ project.tech }}</p>
    <div class="flex flex-wrap gap-2">
      <NuxtLink :to="`/project/${filename}`" class="text-blue-600 hover:underline">
        🔎 View Project
      </NuxtLink>
      <button 
        @click="showDeleteModal = true" 
        class="text-red-600 hover:underline"
        :disabled="isDeleting"
      >
        {{ isDeleting ? '🗑 Deleting...' : '🗑 Delete' }}
      </button>
    </div>

    <!-- Modale de confirmation -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Supprimer le projet"
      :message="`Êtes-vous sûr de vouloir supprimer le projet '${project.title}' ? Cette action est irréversible.`"
      confirm-text="Supprimer"
      :loading="isDeleting"
      @confirm="deleteProject"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from './ConfirmModal.vue';

const props = defineProps({ project: Object });
const router = useRouter();
const isDeleting = ref(false);
const showDeleteModal = ref(false);

const filename = computed(() => props.project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));

const deleteProject = async () => {
  try {
    isDeleting.value = true;
    const response = await $fetch(`/api/delete-project`, {
      method: "POST",
      body: { slug: filename.value },
    });

    if (response.success) {
      showDeleteModal.value = false;
      router.push('/');
    } else {
      throw new Error('La suppression a échoué');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    alert('Une erreur est survenue lors de la suppression du projet. Veuillez réessayer.');
  } finally {
    isDeleting.value = false;
  }
};
</script>

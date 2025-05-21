<template>
  <LayoutDefault>
    <div class="max-w-2xl mx-auto p-6">
      <div v-if="!isCreating" class="space-y-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Créer un nouveau projet</h1>

        <form @submit.prevent="createProject" class="space-y-2">
          <!-- Titre -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Titre du projet
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">Le nom de votre projet</p>
            <input
              type="text"
              id="title"
              v-model="form.title"
              required
              class="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
          </div>

          <!-- Technologies -->
          <div>
            <label for="tech" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technologies
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">Les technologies principales utilisées</p>
            <input
              type="text"
              id="tech"
              v-model="form.tech"
              required
              class="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
          </div>

          <!-- Thème -->
          <div>
            <label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Thème
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">Le thème visuel de votre projet</p>
            <input
              type="text"
              id="theme"
              v-model="form.theme"
              required
              class="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
          </div>

          <!-- Déploiement -->
          <div>
            <label for="deploy" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Déploiement
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">La plateforme de déploiement cible</p>
            <input
              type="text"
              id="deploy"
              v-model="form.deploy"
              required
              class="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">Une description détaillée de votre projet</p>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2"
            ></textarea>
          </div>

          <div class="flex justify-end mt-4">
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Créer le projet
            </button>
          </div>
        </form>
      </div>

      <div v-else>
        <ProjectCreationProgress 
          :project-slug="projectSlug" 
          @creation-completed="handleCreationCompleted" 
        />
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isCreating = ref(false);
const projectSlug = ref("");

// Vérifier l'état au chargement du composant
onMounted(() => {
  const savedState = localStorage.getItem('projectCreationState');
  if (savedState) {
    const { isCreating: savedIsCreating, projectSlug: savedSlug } = JSON.parse(savedState);
    if (savedIsCreating) {
      isCreating.value = true;
      projectSlug.value = savedSlug;
    }
  }
});

const form = ref({
  title: "",
  tech: "",
  theme: "",
  deploy: "",
  description: "",
});

const handleCreationStart = (slug: string) => {
  projectSlug.value = slug;
  isCreating.value = true;
  // Sauvegarder l'état
  localStorage.setItem('projectCreationState', JSON.stringify({
    isCreating: true,
    projectSlug: slug
  }));
};

const handleCreationCompleted = () => {
  isCreating.value = false;
  projectSlug.value = '';
  // Nettoyer l'état
  localStorage.removeItem('projectCreationState');
};

const createProject = async () => {
  try {
    isCreating.value = true;
    const slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    projectSlug.value = slug;

    // Sauvegarder l'état dans localStorage
    localStorage.setItem('projectCreationState', JSON.stringify({
      isCreating: true,
      slug: slug
    }));

    const response = await fetch("/api/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form.value,
        filename: slug,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création du projet");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error("Erreur lors de la création du projet");
    }
  } catch (error) {
    console.error("Erreur:", error);
    isCreating.value = false;
    localStorage.removeItem('projectCreationState');
    // TODO: Afficher une notification d'erreur
  }
};
</script>

<style>
/* Styles de base pour les champs de formulaire */
input[type="text"],
textarea {
  @apply bg-white dark:bg-gray-700;
  @apply text-gray-900 dark:text-white;
  @apply border-2 border-gray-300 dark:border-gray-600;
  @apply focus:border-blue-500 focus:ring-blue-500;
  @apply rounded-md shadow-sm;
  @apply px-3 py-2;
  @apply w-full;
}

/* Styles pour les labels */
label {
  @apply block text-sm font-medium;
  @apply text-gray-700 dark:text-gray-300;
}

/* Styles pour les descriptions */
.text-gray-500 {
  @apply dark:text-gray-400;
}
</style>

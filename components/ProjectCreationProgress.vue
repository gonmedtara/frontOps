<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Création du projet en cours...</h2>
      <div class="flex items-center space-x-2">
        <div class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
        <span class="text-sm text-gray-500">En cours</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="relative">
      <div class="h-2 w-full bg-gray-200 rounded-full">
        <div
          class="h-2 bg-blue-500 rounded-full transition-all duration-500"
          :style="{
            width: `${progressPercentage}%`,
          }"
        ></div>
      </div>
      <div class="mt-2 text-sm text-gray-500 text-right">
        {{ progressPercentage }}%
      </div>
    </div>

    <!-- Steps -->
    <div class="space-y-4">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-start space-x-4 p-4 rounded-lg"
        :class="{
          'bg-gray-50': step.status === 'pending',
          'bg-blue-50': step.status === 'in-progress',
          'bg-green-50': step.status === 'completed',
          'bg-red-50': step.status === 'error',
        }"
      >
        <!-- Status icon -->
        <div class="flex-shrink-0">
          <div
            v-if="step.status === 'pending'"
            class="h-6 w-6 rounded-full border-2 border-gray-300"
          ></div>
          <div
            v-else-if="step.status === 'in-progress'"
            class="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"
          ></div>
          <div
            v-else-if="step.status === 'completed'"
            class="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div
            v-else-if="step.status === 'error'"
            class="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <!-- Step content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">{{ step.name }}</h3>
            <span
              class="text-sm"
              :class="{
                'text-gray-500': step.status === 'pending',
                'text-blue-500': step.status === 'in-progress',
                'text-green-500': step.status === 'completed',
                'text-red-500': step.status === 'error',
              }"
            >
              {{ step.message }}
            </span>
          </div>
          <p
            v-if="step.details"
            class="mt-1 text-sm text-gray-500 whitespace-pre-wrap"
          >
            {{ step.details }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  projectSlug: string;
}>();

const emit = defineEmits<{
  (e: 'creation-completed'): void;
}>();

const router = useRouter();
const steps = ref<any[]>([]);
const currentStep = ref(0);
const isCreating = ref(true);
const pollingInterval = ref<number | null>(null);
const allStepsCompleted = ref(false);

const progressPercentage = computed(() => {
  if (steps.value.length === 0) return 0;
  
  // Calculer la progression en fonction de l'étape actuelle et de son statut
  const totalSteps = steps.value.length;
  let progress = 0;
  
  steps.value.forEach((step, index) => {
    if (step.status === 'completed') {
      progress += 1;
    } else if (step.status === 'in-progress') {
      progress += 0.5;
    }
  });
  
  // S'assurer que la progression ne dépasse pas 100%
  return Math.min(Math.round((progress / totalSteps) * 100), 100);
});

onMounted(() => {
  const savedState = localStorage.getItem('projectCreationState');
  if (savedState) {
    const { isCreating: savedIsCreating, projectSlug: savedSlug } = JSON.parse(savedState);
    if (savedIsCreating && savedSlug) {
      isCreating.value = true;
      projectSlug.value = savedSlug;
    }
  }

  // Démarrer le polling
  fetchStatus();
  pollingInterval.value = window.setInterval(fetchStatus, 500);
});

const fetchStatus = async () => {
  try {
    const response = await fetch(`/api/project-creation-status?slug=${props.projectSlug}`);
    const data = await response.json();
    
    if (data) {
      // Ne mettre à jour que si les données sont différentes
      if (JSON.stringify(steps.value) !== JSON.stringify(data.steps)) {
        steps.value = data.steps.map(step => ({
          ...step,
          // Ne pas afficher les détails pour les tickets
          details: step.name === "Création des tickets" ? undefined : step.details
        }));
      }
      
      if (currentStep.value !== data.currentStep) {
        currentStep.value = data.currentStep;
      }
      
      if (isCreating.value !== data.isCreating) {
        isCreating.value = data.isCreating;
      }

      // Vérifier si toutes les étapes sont terminées
      const allCompleted = data.steps.every(step => step.status === 'completed');
      const isLastStep = currentStep.value === steps.value.length - 1;
      const isLastStepCompleted = isLastStep && steps.value[currentStep.value]?.status === 'completed';

      if (allCompleted && isLastStepCompleted && !allStepsCompleted.value) {
        allStepsCompleted.value = true;
        // Émettre l'événement de complétion immédiatement
        emit('creation-completed');
        // Rediriger après un court délai et nettoyer le localStorage
        setTimeout(() => {
          localStorage.removeItem('projectCreationState');
          router.push(`/project/${props.projectSlug}`);
        }, 1000);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du statut:", error);
  }
};

onUnmounted(() => {
  // Arrêter le polling
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }
});

const handleCreationCompleted = () => {
  isCreating.value = false;
  projectSlug.value = '';
  localStorage.removeItem('projectCreationState');
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 
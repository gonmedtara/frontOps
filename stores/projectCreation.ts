import { defineStore } from "pinia";

interface CreationStep {
  name: string;
  status: "pending" | "in-progress" | "completed" | "error";
  message?: string;
  details?: string;
}

interface CreationState {
  isCreating: boolean;
  currentStep: number;
  steps: CreationStep[];
  projectSlug?: string;
}

export const useProjectCreationStore = defineStore("projectCreation", {
  state: (): CreationState => ({
    isCreating: false,
    currentStep: 0,
    steps: [
      {
        name: "Initialisation",
        status: "pending",
      },
      {
        name: "Création des tickets",
        status: "pending",
      },
      {
        name: "Définition des pages",
        status: "pending",
      },
      {
        name: "Architecture technique",
        status: "pending",
      },
      {
        name: "Bonnes pratiques",
        status: "pending",
      },
      {
        name: "Configuration DevOps",
        status: "pending",
      },
    ],
    projectSlug: undefined,
  }),

  actions: {
    startCreation() {
      this.isCreating = true;
      this.currentStep = 0;
      this.steps.forEach((step) => {
        step.status = "pending";
        step.message = undefined;
        step.details = undefined;
      });
    },

    updateStep(stepIndex: number, update: Partial<CreationStep>) {
      if (this.steps[stepIndex]) {
        this.steps[stepIndex] = { ...this.steps[stepIndex], ...update };
        this.currentStep = stepIndex;
      }
    },

    setProjectSlug(slug: string) {
      this.projectSlug = slug;
    },

    completeCreation() {
      this.isCreating = false;
    },

    reset() {
      this.isCreating = false;
      this.currentStep = 0;
      this.projectSlug = undefined;
      this.steps.forEach((step) => {
        step.status = "pending";
        step.message = undefined;
        step.details = undefined;
      });
    },
  },
}); 
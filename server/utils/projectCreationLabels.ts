export const PROJECT_CREATION_LABELS = {
  steps: {
    initialization: {
      name: "Initialisation du projet",
      pending: "En attente",
      inProgress: "Initialisation du projet en cours...",
      completed: "Projet initialisé"
    },
    tickets: {
      name: "Création des tickets",
      pending: "En attente",
      inProgress: "Création des tickets en cours...",
      completed: (count: number) => `${count} tickets créés`
    },
    pages: {
      name: "Définition des pages",
      pending: "En attente",
      inProgress: "Définition des pages en cours...",
      completed: "Pages définies"
    },
    architecture: {
      name: "Création de l'architecture",
      pending: "En attente",
      inProgress: "Création de l'architecture en cours...",
      completed: "Architecture créée"
    },
    bestPractices: {
      name: "Bonnes pratiques",
      pending: "En attente",
      inProgress: "Définition des bonnes pratiques en cours...",
      completed: "Bonnes pratiques définies"
    },
    devops: {
      name: "Configuration DevOps",
      pending: "En attente",
      inProgress: "Configuration DevOps en cours...",
      completed: "Configuration terminée"
    }
  },
  error: {
    message: "Une erreur est survenue"
  }
} as const; 
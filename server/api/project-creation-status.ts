import fs from "fs";
import path from "path";

// Stockage temporaire de l'état de création
const creationStates = new Map();

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event);
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Le slug du projet est requis",
    });
  }

  const state = creationStates.get(slug);
  return state || { isCreating: false, currentStep: 0, steps: [] };
});

// Fonction pour mettre à jour l'état
export function updateCreationState(slug: string, state: any) {
  creationStates.set(slug, state);
}

// Fonction pour nettoyer l'état
export function clearCreationState(slug: string) {
  creationStates.delete(slug);
} 
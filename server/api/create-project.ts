import path from "path";
import { writeFile } from "fs/promises";
import { join } from "path";
import { updateCreationState, clearCreationState } from "./project-creation-status";
import {
  getInitialState,
  markStepInProgress,
  markStepCompleted,
  CreationState
} from "../utils/projectCreationSteps";
import {
  createProjectDirectory,
  createProjectSections,
  createProjectMetadata,
  createTicketFiles,
  createContextFile,
  createBlueprintFile
} from "../utils/projectFileManager";
import { PROJECT_CREATION_LABELS } from "../utils/projectCreationLabels";
import { callAI } from "./ai";
import { parseTicketsResponse } from "../utils/ticketParser";

/**
 * Crée un nouveau projet avec tous ses composants
 * 1. Initialisation du Projet
 *    - Amélioration de la description
 *    - Création du fichier principal du projet
 *    - Création de la structure des dossiers
 * 2. Création des tickets avec le Product Owner
 * 3. Définition des pages avec l'Architecte
 * 4. Création de l'architecture technique
 * 5. Définition des bonnes pratiques
 * 6. Configuration de l'environnement DevOps
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, tech, theme, deploy, description, filename } = body;
  const now = new Date().toISOString();

  // Initialiser l'état
  const initialState = getInitialState();
  updateCreationState(filename, initialState);

  try {
    // Initialiser le contexte cumulatif
    let currentContext: any = { title, tech, theme, deploy, description, filename };

    // 1. Initialisation du Projet
    let currentState = markStepInProgress(
      initialState,
      0,
      PROJECT_CREATION_LABELS.steps.initialization.inProgress
    );
    updateCreationState(filename, currentState);

    // Améliorer la description
    const enhancedDescription = await callAI("DESCRIPTION_ENHANCER", currentContext);
    currentContext.description = enhancedDescription;

    // Créer la structure du projet
    const basePath = path.resolve("./content/projects", filename);
    createProjectDirectory(basePath);
    createProjectSections(basePath, ["tickets", "context", "blueprints"]);
    createProjectMetadata(basePath, filename, { ...currentContext, createdAt: now });

    currentState = markStepCompleted(
      currentState,
      0,
      PROJECT_CREATION_LABELS.steps.initialization.completed
    );
    updateCreationState(filename, currentState);

    // 2. Création des tickets
    currentState = markStepInProgress(
      currentState,
      1,
      PROJECT_CREATION_LABELS.steps.tickets.inProgress
    );
    updateCreationState(filename, currentState);

    const ticketsMd = await callAI("PO", currentContext);
    
    console.log("Réponse brute de l'IA (PO):", ticketsMd);

    // Utiliser la nouvelle fonction pour parser les tickets
    const tickets = parseTicketsResponse(ticketsMd, filename);
    
    console.log("Tickets parsés:", tickets);

    // Créer les fichiers de tickets uniquement si des tickets ont été parsés
    if (tickets.length > 0) {
        createTicketFiles(basePath, filename, tickets);
    } else {
        console.warn("No tickets were parsed from AI response.");
    }

    currentContext.tickets = JSON.stringify(tickets);

    currentState = markStepCompleted(
      currentState,
      1,
      PROJECT_CREATION_LABELS.steps.tickets.completed(tickets.length)
    );
    updateCreationState(filename, currentState);

    // 3. Définition des pages
    currentState = markStepInProgress(
      currentState,
      2,
      PROJECT_CREATION_LABELS.steps.pages.inProgress
    );
    updateCreationState(filename, currentState);

    const pagesMd = await callAI("ARCHITECT_PAGES", currentContext);
    createContextFile(basePath, filename, "pages", pagesMd);
    currentContext.pages = pagesMd;

    currentState = markStepCompleted(
      currentState,
      2,
      PROJECT_CREATION_LABELS.steps.pages.completed
    );
    updateCreationState(filename, currentState);

    // 4. Architecture technique
    currentState = markStepInProgress(
      currentState,
      3,
      PROJECT_CREATION_LABELS.steps.architecture.inProgress
    );
    updateCreationState(filename, currentState);

    const architectureMd = await callAI("ARCHITECT", currentContext);
    createContextFile(basePath, filename, "architecture", architectureMd);
    currentContext.architecture = architectureMd;

    currentState = markStepCompleted(
      currentState,
      3,
      PROJECT_CREATION_LABELS.steps.architecture.completed
    );
    updateCreationState(filename, currentState);

    // 5. Bonnes pratiques
    currentState = markStepInProgress(
      currentState,
      4,
      PROJECT_CREATION_LABELS.steps.bestPractices.inProgress
    );
    updateCreationState(filename, currentState);

    const bestPracticesMd = await callAI("BEST_PRACTICES", currentContext);
    createContextFile(basePath, filename, "best-practices", bestPracticesMd);
    currentContext.bestPractices = bestPracticesMd;

    currentState = markStepCompleted(
      currentState,
      4,
      PROJECT_CREATION_LABELS.steps.bestPractices.completed
    );
    updateCreationState(filename, currentState);

    // 6. Configuration DevOps
    currentState = markStepInProgress(
      currentState,
      5,
      PROJECT_CREATION_LABELS.steps.devops.inProgress
    );
    updateCreationState(filename, currentState);

    const blueprintMd = await callAI("DEVOPS", currentContext);
    createBlueprintFile(basePath, filename, blueprintMd);

    // Créer un état final explicite
    const finalState = markStepCompleted(
      currentState,
      5,
      PROJECT_CREATION_LABELS.steps.devops.completed
    );
    updateCreationState(filename, finalState);

    // Attendre que le client reçoive l'état final
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Nettoyer l'état de création
    clearCreationState(filename);

    return { success: true };
  } catch (error: any) {
    console.error("Erreur lors de la création du projet:", error);
    
    // Mettre à jour l'état avec l'erreur
    const errorState = {
      ...initialState,
      steps: initialState.steps.map((step, index) => 
        index === initialState.currentStep ? { 
          ...step, 
          status: "error", 
          message: PROJECT_CREATION_LABELS.error.message,
          details: error.message || String(error)
        } : step
      ),
    };
    updateCreationState(filename, errorState);

    throw error;
  }
});

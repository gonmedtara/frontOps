import { PROJECT_CREATION_LABELS } from './projectCreationLabels';

export interface CreationStep {
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message: string;
  details?: string;
}

export interface CreationState {
  isCreating: boolean;
  currentStep: number;
  steps: CreationStep[];
}

export const INITIAL_STEPS: CreationStep[] = [
  {
    name: PROJECT_CREATION_LABELS.steps.initialization.name,
    status: "pending",
    message: PROJECT_CREATION_LABELS.steps.initialization.pending,
  },
  {
    name: PROJECT_CREATION_LABELS.steps.tickets.name,
    status: "pending",
    message: PROJECT_CREATION_LABELS.steps.tickets.pending,
  },
  {
    name: PROJECT_CREATION_LABELS.steps.pages.name,
    status: "pending",
    message: PROJECT_CREATION_LABELS.steps.pages.pending,
  },
  {
    name: PROJECT_CREATION_LABELS.steps.architecture.name,
    status: "pending",
    message: PROJECT_CREATION_LABELS.steps.architecture.pending,
  },
  {
    name: PROJECT_CREATION_LABELS.steps.bestPractices.name,
    status: "pending",
    message: PROJECT_CREATION_LABELS.steps.bestPractices.pending,
  },
  {
    name: PROJECT_CREATION_LABELS.steps.devops.name,
    status: "pending",
    message: PROJECT_CREATION_LABELS.steps.devops.pending,
  }
];

export const getInitialState = (): CreationState => ({
  isCreating: true,
  currentStep: 0,
  steps: INITIAL_STEPS,
});

export const updateStepStatus = (
  state: CreationState,
  stepIndex: number,
  status: CreationStep['status'],
  message: string,
  details?: string
): CreationState => ({
  ...state,
  steps: state.steps.map((step, index) =>
    index === stepIndex
      ? { ...step, status, message, ...(details && { details }) }
      : step
  ),
});

export const markStepInProgress = (
  state: CreationState,
  stepIndex: number,
  message: string
): CreationState => ({
  ...state,
  currentStep: stepIndex,
  steps: state.steps.map((step, index) =>
    index === stepIndex
      ? { ...step, status: 'in-progress', message }
      : step
  ),
});

export const markStepCompleted = (
  state: CreationState,
  stepIndex: number,
  message: string,
  details?: string
): CreationState => ({
  ...state,
  steps: state.steps.map((step, index) =>
    index === stepIndex
      ? { ...step, status: 'completed', message, ...(details && { details }) }
      : step
  ),
}); 
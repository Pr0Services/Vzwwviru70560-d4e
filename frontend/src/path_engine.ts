/* =========================================
   CHEÂ·NU â€” PATH ENGINE
   
   Moteur de navigation par chemins.
   ImplÃ©mente le manifeste directionnel.
   
   ðŸ“œ Le systÃ¨me guide sans jamais contraindre.
   ========================================= */

import {
  PathType,
  PathState,
  PathStep,
  PathOption,
  PathScratch,
  UserIntention,
  ValidationRequest,
  ValidationResult,
  RetreatConfig,
  PATHS,
  OPTIONS,
  RETREAT_RULES,
  parseIntention,
  canWriteToTimeline,
  getAllowedOptions,
  PATH_LAWS,
} from './path.types';

import { logger } from './utils/logger';

const pathLogger = logger.scope('Path');

// ============================================
// Ã‰TAT GLOBAL
// ============================================

/** Ã‰tat initial vide */
const createInitialScratch = (): PathScratch => ({
  notes: [],
  ideasMarked: [],
  explorationHistory: [],
});

/** Ã‰tat initial */
const createInitialState = (): PathState => ({
  current: 'reprise', // Par dÃ©faut: reprise
  enteredAt: Date.now(),
  activeOption: undefined,
  scratch: createInitialScratch(),
  canRetreat: true,
  steps: [],
});

/** Ã‰tat courant */
let currentState: PathState = createInitialState();

/** Historique des intentions */
const intentionHistory: UserIntention[] = [];

/** File de validations en attente */
const pendingValidations: ValidationRequest[] = [];

// ============================================
// NAVIGATION
// ============================================

/**
 * Entrer dans un chemin
 * @param path - Le chemin cible
 * @param intention - L'intention utilisateur (optionnelle)
 */
export function enterPath(path: PathType, intention?: string): PathState {
  const config = PATHS[path];
  
  pathLogger.info(`Entering path: ${path}`, { intention });
  
  // Enregistrer l'intention
  if (intention) {
    intentionHistory.push({
      phrase: intention,
      path,
      timestamp: Date.now(),
    });
  }
  
  // CrÃ©er le nouvel Ã©tat
  currentState = {
    current: path,
    enteredAt: Date.now(),
    activeOption: undefined,
    scratch: createInitialScratch(),
    canRetreat: true,
    steps: [],
  };
  
  pathLogger.debug(`Path entered: ${config.intention}`);
  
  return currentState;
}

/**
 * ExÃ©cuter une option dans le chemin actuel
 * @param option - L'option Ã  exÃ©cuter
 * @param data - DonnÃ©es associÃ©es (optionnelles)
 */
export function executeOption(option: PathOption, data?: unknown): PathStep | null {
  const allowed = getAllowedOptions(currentState.current);
  
  // VÃ©rifier si l'option est autorisÃ©e
  if (!allowed.includes(option)) {
    pathLogger.warn(`Option not allowed in path ${currentState.current}: ${option}`);
    return null;
  }
  
  const optionConfig = OPTIONS[option];
  
  pathLogger.info(`Executing option: ${option}`, { question: optionConfig.question });
  
  // CrÃ©er l'Ã©tape
  const step: PathStep = {
    option,
    timestamp: Date.now(),
    validated: !optionConfig.requiresValidation,
    data,
  };
  
  // Si validation requise, crÃ©er une demande
  if (optionConfig.requiresValidation) {
    const validation: ValidationRequest = {
      type: option === 'marquageIdee' ? 'mark' : 'decision',
      description: optionConfig.description,
      data,
      path: currentState.current,
      requestedAt: Date.now(),
    };
    pendingValidations.push(validation);
    
    pathLogger.debug('Validation required', { option });
  }
  
  // Ajouter l'Ã©tape
  currentState.steps.push(step);
  currentState.activeOption = option;
  
  return step;
}

/**
 * Valider une action en attente
 * @param confirm - True pour valider, false pour annuler
 */
export function validate(confirm: boolean): ValidationResult {
  const pending = pendingValidations.pop();
  
  if (!pending) {
    pathLogger.warn('No pending validation');
    return {
      validated: false,
      validatedBy: 'user',
      timestamp: Date.now(),
      canWriteToTimeline: false,
    };
  }
  
  const result: ValidationResult = {
    validated: confirm,
    validatedBy: 'user',
    timestamp: Date.now(),
    canWriteToTimeline: confirm && canWriteToTimeline(pending.path),
  };
  
  // Marquer l'Ã©tape comme validÃ©e
  if (confirm && currentState.steps.length > 0) {
    currentState.steps[currentState.steps.length - 1].validated = true;
  }
  
  pathLogger.info(`Validation: ${confirm ? 'confirmed' : 'cancelled'}`, {
    type: pending.type,
    canWriteToTimeline: result.canWriteToTimeline,
  });
  
  return result;
}

// ============================================
// RECUL (ROLLBACK)
// ============================================

/**
 * Reculer dans le chemin actuel
 * PRINCIPE: On ne supprime jamais, on repositionne
 */
export function retreat(config?: Partial<RetreatConfig>): PathState {
  const rule = RETREAT_RULES[currentState.current];
  
  pathLogger.info(`Retreat in path: ${currentState.current}`, { rule: rule.target });
  
  // IMPORTANT: Ne jamais Ã©crire dans la timeline lors du recul
  if (rule.writesToTimeline) {
    pathLogger.error('VIOLATION: Retreat cannot write to timeline');
    throw new Error('Retreat cannot write to timeline - LAW 3');
  }
  
  // PrÃ©server les notes si configurÃ©
  const preservedNotes = config?.preserveNotes !== false ? currentState.scratch.notes : [];
  
  // Selon la cible
  switch (rule.target) {
    case 'neutral':
      currentState = createInitialState();
      break;
      
    case 'lastStable':
      // Garder le chemin mais rÃ©initialiser les Ã©tapes non validÃ©es
      currentState.steps = currentState.steps.filter((s) => s.validated);
      currentState.activeOption = undefined;
      break;
      
    case 'previousContext':
      // Revenir au contexte prÃ©cÃ©dent (mais la dÃ©cision reste)
      currentState.activeOption = undefined;
      break;
  }
  
  // Restaurer les notes prÃ©servÃ©es
  currentState.scratch.notes = preservedNotes;
  
  pathLogger.debug('Retreat completed', { target: rule.target });
  
  return currentState;
}

// ============================================
// EXPLORATION (Chemin C)
// ============================================

/**
 * Ajouter une note d'exploration
 * NON sauvegardÃ©e automatiquement
 */
export function addNote(note: string): void {
  if (currentState.current !== 'exploration') {
    pathLogger.warn('Notes only in exploration path');
    return;
  }
  
  currentState.scratch.notes.push(note);
  currentState.scratch.explorationHistory.push(`note:${Date.now()}`);
  
  pathLogger.debug('Note added (not saved)', { noteLength: note.length });
}

/**
 * Marquer une idÃ©e comme importante
 * NÃ‰CESSITE validation pour Ã©criture timeline
 */
export function markIdea(ideaId: string): ValidationRequest | null {
  if (currentState.current !== 'exploration') {
    pathLogger.warn('Marking only in exploration path');
    return null;
  }
  
  // Utiliser l'option qui nÃ©cessite validation
  executeOption('marquageIdee', { ideaId });
  
  currentState.scratch.ideasMarked.push(ideaId);
  
  return pendingValidations[pendingValidations.length - 1] ?? null;
}

// ============================================
// DÃ‰CISION (Chemin D)
// ============================================

/**
 * PrÃ©parer une dÃ©cision
 * @param description - Description de la dÃ©cision
 */
export function prepareDecision(description: string): ValidationRequest {
  if (currentState.current !== 'decision') {
    // Basculer automatiquement vers le chemin dÃ©cision
    enterPath('decision', `Je dois dÃ©cider: ${description}`);
  }
  
  const validation: ValidationRequest = {
    type: 'decision',
    description,
    data: { description, preparedAt: Date.now() },
    path: 'decision',
    requestedAt: Date.now(),
  };
  
  pendingValidations.push(validation);
  
  pathLogger.info('Decision prepared, awaiting validation', { description });
  
  return validation;
}

// ============================================
// SESSION
// ============================================

/**
 * Ã‰lÃ©ments de session Ã  sauvegarder
 */
export interface SessionData {
  preset: string;
  sphere: string;
  objective?: string;
  timelinePointer: number;
  lastPath: PathType;
}

/**
 * Obtenir les donnÃ©es de session Ã  sauvegarder
 */
export function getSessionData(
  preset: string,
  sphere: string,
  timelinePointer: number,
  objective?: string
): SessionData {
  return {
    preset,
    sphere,
    objective,
    timelinePointer,
    lastPath: currentState.current,
  };
}

/**
 * Restaurer une session (Chemin A - Reprise)
 */
export function restoreSession(session: SessionData): PathState {
  pathLogger.info('Restoring session', { lastPath: session.lastPath });
  
  // Entrer dans le chemin reprise
  enterPath('reprise', 'Je reviens continuer');
  
  return currentState;
}

// ============================================
// GETTERS
// ============================================

/** Obtenir l'Ã©tat actuel */
export function getCurrentState(): Readonly<PathState> {
  return { ...currentState };
}

/** Obtenir le chemin actuel */
export function getCurrentPath(): PathType {
  return currentState.current;
}

/** Obtenir l'intention du chemin actuel */
export function getCurrentIntention(): string {
  return PATHS[currentState.current].intention;
}

/** Obtenir les options disponibles */
export function getAvailableOptions(): PathOption[] {
  return getAllowedOptions(currentState.current);
}

/** VÃ©rifier s'il y a des validations en attente */
export function hasPendingValidation(): boolean {
  return pendingValidations.length > 0;
}

/** Obtenir la prochaine validation en attente */
export function getPendingValidation(): ValidationRequest | undefined {
  return pendingValidations[pendingValidations.length - 1];
}

/** Obtenir l'historique des intentions */
export function getIntentionHistory(): readonly UserIntention[] {
  return [...intentionHistory];
}

// ============================================
// RESET (pour tests)
// ============================================

export function resetPathEngine(): void {
  currentState = createInitialState();
  intentionHistory.length = 0;
  pendingValidations.length = 0;
  pathLogger.debug('Path engine reset');
}

// ============================================
// EXPORTS
// ============================================

export { PATHS, OPTIONS, RETREAT_RULES, PATH_LAWS, parseIntention };

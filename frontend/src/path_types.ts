/* =========================================
   CHEÂ·NU â€” SYSTÃˆME DE CHEMINS (PATHS)
   
   ImplÃ©mentation du manifeste directionnel.
   
   ðŸ“œ Un chemin est une suite d'Ã©tats intentionnels validÃ©s.
   ðŸ“œ Un utilisateur navigue dans des CHEMINS d'intention,
      pas dans des Ã©crans.
   ========================================= */

// ============================================
// CHEMINS PRIMAIRES (4 maximum - par design)
// ============================================

/**
 * Les 4 chemins primaires de CHEÂ·NU
 * LIMITATION VOLONTAIRE: Jamais plus de 4
 */
export type PathType = 
  | 'reprise'      // A - "Je reviens continuer"
  | 'objectif'     // B - "Je commence quelque chose"
  | 'exploration'  // C - "Je rÃ©flÃ©chis / je dÃ©couvre"
  | 'decision';    // D - "Je tranche"

/**
 * Configuration d'un chemin
 */
export interface PathConfig {
  /** Identifiant unique du chemin */
  id: PathType;
  /** Intention humaine associÃ©e */
  intention: string;
  /** Description courte */
  description: string;
  /** Preset par dÃ©faut pour ce chemin */
  defaultPreset: string;
  /** Options autorisÃ©es */
  allowedOptions: PathOption[];
  /** Interdictions */
  forbidden: string[];
  /** Peut Ã©crire dans la timeline */
  canWriteTimeline: boolean;
  /** NÃ©cessite validation explicite */
  requiresValidation: boolean;
}

/**
 * Les 4 chemins dÃ©finis
 */
export const PATHS: Record<PathType, PathConfig> = {
  reprise: {
    id: 'reprise',
    intention: 'Je reviens continuer',
    description: 'RÃ©cupÃ©ration du dernier contexte valide',
    defaultPreset: 'focus',
    allowedOptions: ['continuer', 'changerPreset', 'changerSphere'],
    forbidden: ['nouvelleDecision', 'suggestionIntrusive'],
    canWriteTimeline: false,
    requiresValidation: false,
  },
  objectif: {
    id: 'objectif',
    intention: 'Je commence quelque chose',
    description: 'CrÃ©ation d\'un nouvel objectif',
    defaultPreset: 'focus',
    allowedOptions: ['choixSphere', 'choixPreset', 'estimationDuree'],
    forbidden: ['creationImplicite', 'ecritureAutomatique'],
    canWriteTimeline: true,
    requiresValidation: true,
  },
  exploration: {
    id: 'exploration',
    intention: 'Je rÃ©flÃ©chis / je dÃ©couvre',
    description: 'Navigation libre et dÃ©couverte',
    defaultPreset: 'exploration',
    allowedOptions: ['priseNotes', 'basculeFocus', 'marquageIdee'],
    forbidden: ['ecritureAutomatique'],
    canWriteTimeline: false, // Sauf Ã©lÃ©ments marquÃ©s
    requiresValidation: false,
  },
  decision: {
    id: 'decision',
    intention: 'Je tranche',
    description: 'Prise de dÃ©cision explicite',
    defaultPreset: 'audit',
    allowedOptions: ['voirContexte', 'demanderAnalyse', 'comparerOptions'],
    forbidden: ['suppressionDecision'],
    canWriteTimeline: true,
    requiresValidation: true,
  },
};

// ============================================
// OPTIONS DE CHEMIN
// ============================================

/**
 * Options possibles dans un chemin
 * RÃˆGLE: Toute option rÃ©pond Ã  une question claire et unique
 */
export type PathOption =
  // Reprise
  | 'continuer'
  | 'changerPreset'
  | 'changerSphere'
  // Objectif
  | 'choixSphere'
  | 'choixPreset'
  | 'estimationDuree'
  // Exploration
  | 'priseNotes'
  | 'basculeFocus'
  | 'marquageIdee'
  // DÃ©cision
  | 'voirContexte'
  | 'demanderAnalyse'
  | 'comparerOptions';

/**
 * Configuration d'une option
 */
export interface OptionConfig {
  id: PathOption;
  question: string;
  description: string;
  requiresValidation: boolean;
}

/**
 * Options dÃ©finies avec leurs questions
 */
export const OPTIONS: Record<PathOption, OptionConfig> = {
  continuer: {
    id: 'continuer',
    question: 'Continuer oÃ¹ vous Ã©tiez ?',
    description: 'Reprendre le travail en cours',
    requiresValidation: false,
  },
  changerPreset: {
    id: 'changerPreset',
    question: 'Changer de mode ?',
    description: 'Modifier le preset actif',
    requiresValidation: false,
  },
  changerSphere: {
    id: 'changerSphere',
    question: 'Changer de domaine ?',
    description: 'Basculer vers une autre sphÃ¨re',
    requiresValidation: false,
  },
  choixSphere: {
    id: 'choixSphere',
    question: 'Dans quel domaine ?',
    description: 'SÃ©lectionner la sphÃ¨re concernÃ©e',
    requiresValidation: false,
  },
  choixPreset: {
    id: 'choixPreset',
    question: 'Quel mode de travail ?',
    description: 'Choisir le preset adaptÃ©',
    requiresValidation: false,
  },
  estimationDuree: {
    id: 'estimationDuree',
    question: 'Combien de temps ?',
    description: 'Estimer la durÃ©e de la tÃ¢che',
    requiresValidation: false,
  },
  priseNotes: {
    id: 'priseNotes',
    question: 'Noter cette idÃ©e ?',
    description: 'Capturer une rÃ©flexion',
    requiresValidation: false,
  },
  basculeFocus: {
    id: 'basculeFocus',
    question: 'Passer en mode focus ?',
    description: 'Concentrer l\'attention',
    requiresValidation: false,
  },
  marquageIdee: {
    id: 'marquageIdee',
    question: 'Marquer comme important ?',
    description: 'Sauvegarder dans la timeline',
    requiresValidation: true,
  },
  voirContexte: {
    id: 'voirContexte',
    question: 'Voir le contexte ?',
    description: 'Afficher les informations pertinentes',
    requiresValidation: false,
  },
  demanderAnalyse: {
    id: 'demanderAnalyse',
    question: 'Demander une analyse ?',
    description: 'Consulter les agents pour avis',
    requiresValidation: false,
  },
  comparerOptions: {
    id: 'comparerOptions',
    question: 'Comparer les options ?',
    description: 'Voir les alternatives cÃ´te Ã  cÃ´te',
    requiresValidation: false,
  },
};

// ============================================
// Ã‰TAT DU CHEMIN
// ============================================

/**
 * Ã‰tat actuel dans un chemin
 */
export interface PathState {
  /** Chemin actif */
  current: PathType;
  /** Timestamp d'entrÃ©e dans le chemin */
  enteredAt: number;
  /** Option en cours */
  activeOption?: PathOption;
  /** DonnÃ©es temporaires (non sauvegardÃ©es) */
  scratch: PathScratch;
  /** Peut reculer */
  canRetreat: boolean;
  /** Historique des Ã©tapes dans ce chemin */
  steps: PathStep[];
}

/**
 * DonnÃ©es temporaires d'exploration
 * NON sauvegardÃ©es automatiquement
 */
export interface PathScratch {
  notes: string[];
  ideasMarked: string[];
  explorationHistory: string[];
}

/**
 * Une Ã©tape dans un chemin
 */
export interface PathStep {
  option: PathOption;
  timestamp: number;
  validated: boolean;
  data?: unknown;
}

// ============================================
// INTENTION
// ============================================

/**
 * Une intention utilisateur
 * Doit Ãªtre exprimable en une phrase simple
 */
export interface UserIntention {
  /** Phrase d'intention */
  phrase: string;
  /** Chemin correspondant */
  path: PathType;
  /** Timestamp */
  timestamp: number;
  /** Contexte (sphÃ¨re, preset, etc.) */
  context?: IntentionContext;
}

export interface IntentionContext {
  sphere?: string;
  preset?: string;
  objective?: string;
}

/**
 * Mapper une phrase Ã  un chemin
 */
export function parseIntention(phrase: string): PathType {
  const lower = phrase.toLowerCase();
  
  if (lower.includes('revenir') || lower.includes('continuer') || lower.includes('reprendre')) {
    return 'reprise';
  }
  if (lower.includes('commencer') || lower.includes('nouveau') || lower.includes('crÃ©er')) {
    return 'objectif';
  }
  if (lower.includes('explorer') || lower.includes('dÃ©couvrir') || lower.includes('rÃ©flÃ©chir')) {
    return 'exploration';
  }
  if (lower.includes('dÃ©cider') || lower.includes('trancher') || lower.includes('choisir')) {
    return 'decision';
  }
  
  // Par dÃ©faut: exploration (le plus sÃ»r)
  return 'exploration';
}

// ============================================
// RECUL (ROLLBACK)
// ============================================

/**
 * Configuration du recul
 * PRINCIPE: On ne supprime jamais, on repositionne
 */
export interface RetreatConfig {
  /** Point de lecture cible */
  targetTimestamp: number;
  /** Raison du recul */
  reason?: string;
  /** PrÃ©server les notes d'exploration */
  preserveNotes: boolean;
}

/**
 * RÃ¨gles de recul par chemin
 */
export const RETREAT_RULES: Record<PathType, RetreatRule> = {
  reprise: {
    target: 'neutral', // Ã‰tat neutre initial
    preserveHistory: true,
    writesToTimeline: false,
  },
  objectif: {
    target: 'neutral', // Annuler avant validation
    preserveHistory: true,
    writesToTimeline: false,
  },
  exploration: {
    target: 'lastStable', // Dernier Ã©tat stable
    preserveHistory: true,
    writesToTimeline: false,
  },
  decision: {
    target: 'previousContext', // Contexte prÃ©cÃ©dent
    preserveHistory: true,
    writesToTimeline: false, // MAIS la dÃ©cision reste inscrite
  },
};

export interface RetreatRule {
  target: 'neutral' | 'lastStable' | 'previousContext';
  preserveHistory: boolean;
  writesToTimeline: boolean;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validation humaine requise
 */
export interface ValidationRequest {
  /** Type de validation */
  type: 'decision' | 'objective' | 'mark';
  /** Description de ce qui sera validÃ© */
  description: string;
  /** DonnÃ©es Ã  valider */
  data: unknown;
  /** Chemin source */
  path: PathType;
  /** Timestamp de la demande */
  requestedAt: number;
}

/**
 * RÃ©sultat de validation
 */
export interface ValidationResult {
  /** ValidÃ© ou non */
  validated: boolean;
  /** Par l'utilisateur */
  validatedBy: 'user';
  /** Timestamp */
  timestamp: number;
  /** Peut Ãªtre Ã©crit dans timeline */
  canWriteToTimeline: boolean;
}

// ============================================
// HELPERS
// ============================================

/**
 * VÃ©rifier si un chemin peut Ã©crire dans la timeline
 */
export function canWriteToTimeline(path: PathType): boolean {
  return PATHS[path].canWriteTimeline;
}

/**
 * Obtenir les options autorisÃ©es pour un chemin
 */
export function getAllowedOptions(path: PathType): PathOption[] {
  return PATHS[path].allowedOptions;
}

/**
 * VÃ©rifier si une option nÃ©cessite validation
 */
export function requiresValidation(option: PathOption): boolean {
  return OPTIONS[option].requiresValidation;
}

/**
 * Obtenir la question d'une option
 */
export function getOptionQuestion(option: PathOption): string {
  return OPTIONS[option].question;
}

// ============================================
// EXPORT DES LOIS
// ============================================

export const PATH_LAWS = [
  'Timeline = VÃ©ritÃ© Absolue (append-only)',
  'Validation Humaine Obligatoire',
  'Recul = Repositionnement (jamais suppression)',
  '4 Chemins Maximum (ABCD)',
  'Humain > SystÃ¨me, Toujours',
] as const;

export type PathLaw = typeof PATH_LAWS[number];

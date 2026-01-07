/* =========================================
   CHEÂ·NU â€” CONSTITUTION TYPES
   
   Types TypeScript pour la constitution fondamentale.
   Ces types sont IMMUABLES et dÃ©finissent les rÃ¨gles
   que le systÃ¨me DOIT respecter.
   
   âš–ï¸ "L'humain dÃ©cide, le systÃ¨me trace"
   ========================================= */

// ============================================
// PRINCIPES FONDAMENTAUX
// ============================================

/** Les 5 principes inviolables de CHEÂ·NU */
export interface ConstitutionPrinciples {
  /** L'humain est toujours dans la boucle de dÃ©cision */
  humanInTheLoop: true;
  /** La timeline est la seule source de vÃ©ritÃ© */
  timelineIsTruth: true;
  /** Aucune dÃ©cision automatique */
  noAutoDecision: true;
  /** Les agents conseillent uniquement, ne dÃ©cident jamais */
  agentsAdviseOnly: true;
  /** Le rollback est une rÃ©interprÃ©tation, pas une rÃ©Ã©criture */
  rollbackIsInterpretation: true;
}

// ============================================
// TIMELINE
// ============================================

/** Configuration de la timeline */
export interface TimelineConfig {
  /** Mode d'Ã©criture - append-only uniquement */
  mode: 'append-only';
  /** La timeline ne peut jamais Ãªtre modifiÃ©e */
  modifiable: false;
  /** Source unique de vÃ©ritÃ© */
  sourceOfTruth: true;
  /** Condition d'Ã©criture */
  writeCondition: 'explicit_human_validation';
}

// ============================================
// PATHS (Chemins de Navigation)
// ============================================

/** Mode de sauvegarde */
export type SaveMode = 'automatic' | 'explicit' | 'selective' | 'mandatory';

/** Configuration de sauvegarde */
export interface SaveConfig {
  mode: SaveMode;
  conditions: string[];
}

/** DÃ©finition d'un chemin */
export interface PathDefinition {
  /** Intention du chemin */
  intent: string;
  /** Point d'entrÃ©e */
  entry: string;
  /** Options disponibles */
  options: string[];
  /** StratÃ©gie de rollback */
  rollback: string;
  /** Configuration de sauvegarde */
  save: SaveConfig;
  /** Restrictions */
  restrictions: string[];
}

/** Les 4 chemins primaires */
export interface ConstitutionPaths {
  /** Reprendre le contexte prÃ©cÃ©dent */
  resume: PathDefinition;
  /** DÃ©marrer un nouvel objectif */
  newObjective: PathDefinition;
  /** Explorer sans engagement */
  exploration: PathDefinition;
  /** Prendre une dÃ©cision explicite */
  decision: PathDefinition;
}

// ============================================
// RÃˆGLES D'OPTIONS
// ============================================

/** RÃ¨gles des options */
export interface OptionsRules {
  /** Actions autorisÃ©es */
  allowed: readonly [
    'change_preset',
    'save_idea',
    'continue_or_return'
  ];
  /** Actions strictement interdites */
  forbidden: readonly [
    'silent_automation',
    'implicit_decision',
    'unexplained_optimization'
  ];
}

// ============================================
// ROLLBACK
// ============================================

/** Configuration du rollback */
export interface RollbackConfig {
  /** StratÃ©gie: rÃ©interprÃ©ter, jamais rÃ©Ã©crire */
  strategy: 'reinterpret_state';
  /** Le rollback n'Ã©crit JAMAIS dans la timeline */
  writesTimeline: false;
  /** Actions autorisÃ©es */
  allowedActions: readonly [
    'change_active_pointer',
    'reopen_previous_context'
  ];
  /** Actions strictement interdites */
  forbiddenActions: readonly [
    'delete_event',
    'rewrite_timeline',
    'mask_history'
  ];
}

// ============================================
// PERSISTENCE DE SESSION
// ============================================

/** Configuration de persistence */
export interface SessionPersistence {
  /** Moments de sauvegarde */
  saveOn: readonly ['explicit_validation', 'session_end'];
  /** DonnÃ©es Ã  persister */
  store: readonly [
    'active_preset',
    'active_sphere',
    'last_valid_objective',
    'timeline_pointer'
  ];
  /** DonnÃ©es Ã  ignorer */
  ignore: readonly [
    'visual_state',
    'unvalidated_hesitation',
    'temporary_exploration'
  ];
}

// ============================================
// LIMITATIONS
// ============================================

/** Limitations systÃ¨me */
export interface ConstitutionLimitations {
  /** Maximum 4 chemins primaires */
  maxPrimaryPaths: 4;
  /** Aucune suppression destructive autorisÃ©e */
  allowUndoDestructive: false;
  /** Les agents ne peuvent JAMAIS dÃ©cider */
  allowAgentDecision: false;
  /** Un seul preset actif Ã  la fois */
  maxSimultaneousPresets: 1;
  /** ZÃ©ro prompt intrusif */
  maxIntrusivePrompts: 0;
}

// ============================================
// CRITÃˆRES DE SUCCÃˆS
// ============================================

/** CritÃ¨res de succÃ¨s UX */
export interface SuccessCriteria {
  /** L'utilisateur comprend toujours sa position */
  userUnderstandsPosition: true;
  /** L'exploration est sans risque */
  safeExploration: true;
  /** Quitter l'app est sans stress */
  stressFreeExit: true;
  /** Reprendre est facile */
  easyResumption: true;
}

// ============================================
// CONSTITUTION COMPLÃˆTE
// ============================================

/** La Constitution CHEÂ·NU v1.0 */
export interface CheNuConstitution {
  cheNuVersion: 'foundation-1.0';
  principles: ConstitutionPrinciples;
  timeline: TimelineConfig;
  paths: ConstitutionPaths;
  optionsRules: OptionsRules;
  rollback: RollbackConfig;
  sessionPersistence: SessionPersistence;
  limitations: ConstitutionLimitations;
  successCriteria: SuccessCriteria;
}

// ============================================
// VIOLATIONS
// ============================================

/** Types de violation de la constitution */
export type ViolationType =
  | 'TIMELINE_MODIFICATION'
  | 'AUTO_DECISION'
  | 'AGENT_DECISION'
  | 'SILENT_AUTOMATION'
  | 'IMPLICIT_DECISION'
  | 'TIMELINE_DELETE'
  | 'HISTORY_MASK'
  | 'INTRUSIVE_PROMPT'
  | 'MULTI_PRESET'
  | 'DESTRUCTIVE_UNDO';

/** Une violation dÃ©tectÃ©e */
export interface ConstitutionViolation {
  type: ViolationType;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  timestamp: number;
  context?: Record<string, unknown>;
}

// ============================================
// CONSTANTES IMMUABLES
// ============================================

/** Les principes sous forme de lois */
export const CONSTITUTION_LAWS = [
  'L\'humain est toujours dans la boucle',
  'La timeline est immuable et append-only',
  'Aucune dÃ©cision automatique',
  'Les agents conseillent, ne dÃ©cident jamais',
  'Le rollback rÃ©interprÃ¨te, ne rÃ©Ã©crit jamais',
] as const;

/** Actions interdites - JAMAIS autorisÃ©es */
export const FORBIDDEN_ACTIONS = [
  'silent_automation',
  'implicit_decision',
  'unexplained_optimization',
  'delete_event',
  'rewrite_timeline',
  'mask_history',
] as const;

/** VÃ©rifier si une action est interdite */
export function isForbiddenAction(action: string): boolean {
  return (FORBIDDEN_ACTIONS as readonly string[]).includes(action);
}

// ============================================
// TYPE GUARDS
// ============================================

/** VÃ©rifie si un objet est une violation */
export function isViolation(obj: unknown): obj is ConstitutionViolation {
  if (!obj || typeof obj !== 'object') return false;
  const v = obj as Record<string, unknown>;
  return (
    typeof v.type === 'string' &&
    typeof v.message === 'string' &&
    typeof v.severity === 'string' &&
    typeof v.timestamp === 'number'
  );
}

/** VÃ©rifie si les principes sont respectÃ©s */
export function validatePrinciples(principles: unknown): principles is ConstitutionPrinciples {
  if (!principles || typeof principles !== 'object') return false;
  const p = principles as Record<string, unknown>;
  return (
    p.humanInTheLoop === true &&
    p.timelineIsTruth === true &&
    p.noAutoDecision === true &&
    p.agentsAdviseOnly === true &&
    p.rollbackIsInterpretation === true
  );
}

/**
 * CHE·NU™ OneClick Engine Module
 * Natural language command processing with workflow automation
 * 
 * @module oneclick
 * @version 33.0
 */

export { default as OneClickPanel } from './OneClickPanel';

// Types
export type WorkflowCategory = 'document' | 'analysis' | 'creation' | 'automation' | 'communication';
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface OneClickWorkflow {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  triggerPatterns: string[];
  estimatedTime: string;
  tokenCost: number;
  requiredInputs: string[];
  outputs: string[];
  icon: string;
}

export interface OneClickExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  results?: unknown;
  error?: string;
}

export interface IntentMatch {
  workflow: OneClickWorkflow;
  confidence: number;
  matchedPatterns: string[];
}

// Constants
export const WORKFLOW_CATEGORIES = {
  document: { label: 'Document', icon: '📄', color: 'blue' },
  analysis: { label: 'Analyse', icon: '📊', color: 'purple' },
  creation: { label: 'Création', icon: '✨', color: 'pink' },
  automation: { label: 'Automatisation', icon: '⚙️', color: 'emerald' },
  communication: { label: 'Communication', icon: '💬', color: 'amber' },
} as const;

// Predefined workflows
export const DEFAULT_WORKFLOWS: Partial<OneClickWorkflow>[] = [
  { name: 'Créer Estimation', category: 'document', triggerPatterns: ['estimate', 'estimation', 'coût'] },
  { name: 'Générer Rapport', category: 'document', triggerPatterns: ['report', 'rapport', 'document'] },
  { name: 'Analyser Données', category: 'analysis', triggerPatterns: ['analyze', 'analyser', 'insight'] },
  { name: 'Organiser Portfolio', category: 'automation', triggerPatterns: ['organize', 'organiser', 'ranger'] },
  { name: 'Rédiger Communication', category: 'communication', triggerPatterns: ['email', 'écrire', 'rédiger'] },
  { name: 'Préparer Pitch', category: 'creation', triggerPatterns: ['pitch', 'présentation', 'deck'] },
  { name: 'Générer Contrat', category: 'document', triggerPatterns: ['contract', 'contrat', 'bail'] },
  { name: 'Planifier Tâches', category: 'automation', triggerPatterns: ['schedule', 'planifier', 'tâches'] },
];

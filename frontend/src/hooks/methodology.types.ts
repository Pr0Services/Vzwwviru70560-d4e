/**
 * CHE·NU - Methodology Types
 */

export type MethodologyId = 'agile' | 'waterfall' | 'kanban' | 'scrum' | 'custom';

export interface Methodology {
  id: MethodologyId;
  name: string;
  description: string;
  phases: Phase[];
  config: MethodologyConfig;
}

export interface Phase {
  id: string;
  name: string;
  order: number;
  duration?: number;
  tasks: string[];
}

export interface MethodologyConfig {
  allowParallel: boolean;
  requireReview: boolean;
  autoProgress: boolean;
  maxIterations?: number;
}

export interface MethodologyState {
  current: MethodologyId | null;
  phase: string | null;
  progress: number;
  history: MethodologyEvent[];
}

export interface MethodologyEvent {
  timestamp: Date;
  type: 'start' | 'phase_change' | 'complete' | 'pause' | 'resume';
  data?: Record<string, unknown>;
}

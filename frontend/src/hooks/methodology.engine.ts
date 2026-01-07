/**
 * CHE·NU - Methodology Engine
 */

import { Methodology, MethodologyId, MethodologyState, Phase } from './methodology.types';

const methodologies: Record<MethodologyId, Methodology> = {
  agile: {
    id: 'agile',
    name: 'Agile',
    description: 'Iterative development with sprints',
    phases: [
      { id: 'planning', name: 'Sprint Planning', order: 1, tasks: [] },
      { id: 'development', name: 'Development', order: 2, tasks: [] },
      { id: 'review', name: 'Sprint Review', order: 3, tasks: [] },
      { id: 'retrospective', name: 'Retrospective', order: 4, tasks: [] },
    ],
    config: { allowParallel: true, requireReview: true, autoProgress: false },
  },
  waterfall: {
    id: 'waterfall',
    name: 'Waterfall',
    description: 'Sequential phase-based approach',
    phases: [
      { id: 'requirements', name: 'Requirements', order: 1, tasks: [] },
      { id: 'design', name: 'Design', order: 2, tasks: [] },
      { id: 'implementation', name: 'Implementation', order: 3, tasks: [] },
      { id: 'testing', name: 'Testing', order: 4, tasks: [] },
      { id: 'deployment', name: 'Deployment', order: 5, tasks: [] },
    ],
    config: { allowParallel: false, requireReview: true, autoProgress: false },
  },
  kanban: {
    id: 'kanban',
    name: 'Kanban',
    description: 'Continuous flow methodology',
    phases: [
      { id: 'backlog', name: 'Backlog', order: 1, tasks: [] },
      { id: 'todo', name: 'To Do', order: 2, tasks: [] },
      { id: 'in_progress', name: 'In Progress', order: 3, tasks: [] },
      { id: 'done', name: 'Done', order: 4, tasks: [] },
    ],
    config: { allowParallel: true, requireReview: false, autoProgress: true },
  },
  scrum: {
    id: 'scrum',
    name: 'Scrum',
    description: 'Agile framework with ceremonies',
    phases: [
      { id: 'sprint_planning', name: 'Sprint Planning', order: 1, tasks: [] },
      { id: 'daily', name: 'Daily Scrum', order: 2, tasks: [] },
      { id: 'sprint', name: 'Sprint', order: 3, tasks: [] },
      { id: 'review', name: 'Sprint Review', order: 4, tasks: [] },
    ],
    config: { allowParallel: true, requireReview: true, autoProgress: false },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'User-defined methodology',
    phases: [],
    config: { allowParallel: true, requireReview: false, autoProgress: false },
  },
};

export const getMethodology = (id: MethodologyId): Methodology => {
  return methodologies[id];
};

export const getAllMethodologies = (): Methodology[] => {
  return Object.values(methodologies);
};

export const createMethodologyState = (id: MethodologyId): MethodologyState => {
  const methodology = getMethodology(id);
  return {
    current: id,
    phase: methodology.phases[0]?.id || null,
    progress: 0,
    history: [{ timestamp: new Date(), type: 'start' }],
  };
};

export const advancePhase = (state: MethodologyState): MethodologyState => {
  if (!state.current) return state;
  
  const methodology = getMethodology(state.current);
  const currentIndex = methodology.phases.findIndex(p => p.id === state.phase);
  const nextPhase = methodology.phases[currentIndex + 1];
  
  if (!nextPhase) return state;
  
  return {
    ...state,
    phase: nextPhase.id,
    progress: ((currentIndex + 2) / methodology.phases.length) * 100,
    history: [...state.history, { timestamp: new Date(), type: 'phase_change' }],
  };
};

export default { getMethodology, getAllMethodologies, createMethodologyState, advancePhase };

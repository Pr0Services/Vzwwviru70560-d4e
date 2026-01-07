/**
 * CHE·NU™ V51 Meta-Layer
 * Decision Crystallizer V1.0 — Hooks
 * 
 * State management hooks for decision crystallization.
 * Maintains decision visibility and traceability.
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DecisionEntry,
  DecisionNature,
  CertaintyLevel,
  DecisionState,
  DecisionFilters,
  DecisionSortOption,
  DecisionDrift,
  DecisionDriftTrigger,
  EmergingDecision,
  DecisionCreationStep,
  DecisionCreationState,
  DecisionCrystallizerUIState,
  DecisionContext,
  AlternativeConsidered,
  DecisionLinkedEntity,
  DecisionRevisitation,
  DecisionPrivacySettings,
  DEFAULT_DECISION_PRIVACY
} from './decision-crystallizer.types';

// ============================================================================
// useDecisions — Main decisions list hook
// ============================================================================

interface UseDecisionsOptions {
  initialFilters?: DecisionFilters;
  initialSort?: DecisionSortOption;
}

interface UseDecisionsReturn {
  decisions: DecisionEntry[];
  filters: DecisionFilters;
  sort: DecisionSortOption;
  setFilters: (filters: DecisionFilters) => void;
  setSort: (sort: DecisionSortOption) => void;
  filteredDecisions: DecisionEntry[];
  addDecision: (decision: DecisionEntry) => void;
  updateDecision: (id: string, updates: Partial<DecisionEntry>) => void;
  removeDecision: (id: string) => void;
  getDecision: (id: string) => DecisionEntry | undefined;
  getRelatedDecisions: (id: string) => DecisionEntry[];
}

/**
 * useDecisions — Manages the list of crystallized decisions
 */
export function useDecisions(
  options: UseDecisionsOptions = {}
): UseDecisionsReturn {
  const [decisions, setDecisions] = useState<DecisionEntry[]>([]);
  const [filters, setFilters] = useState<DecisionFilters>(options.initialFilters || {});
  const [sort, setSort] = useState<DecisionSortOption>(options.initialSort || 'recent_first');

  // Filter decisions
  const filteredDecisions = useMemo(() => {
    let result = [...decisions];

    // Filter by nature
    if (filters.natures?.length) {
      result = result.filter(d => filters.natures!.includes(d.nature));
    }

    // Filter by certainty
    if (filters.certainties?.length) {
      result = result.filter(d => filters.certainties!.includes(d.certainty));
    }

    // Filter by state
    if (filters.states?.length) {
      result = result.filter(d => filters.states!.includes(d.state));
    }

    // Filter by sphere
    if (filters.spheres?.length) {
      result = result.filter(d => d.sphere && filters.spheres!.includes(d.sphere));
    }

    // Filter by tags
    if (filters.tags?.length) {
      result = result.filter(d => 
        d.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    // Filter by review reminder
    if (filters.has_review_reminder !== undefined) {
      result = result.filter(d => 
        filters.has_review_reminder ? !!d.review_reminder : !d.review_reminder
      );
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(search) ||
        d.statement.toLowerCase().includes(search) ||
        d.rationale?.toLowerCase().includes(search) ||
        d.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    // Date range filter
    if (filters.date_range?.from) {
      const from = new Date(filters.date_range.from).getTime();
      result = result.filter(d => new Date(d.crystallized_at).getTime() >= from);
    }
    if (filters.date_range?.to) {
      const to = new Date(filters.date_range.to).getTime();
      result = result.filter(d => new Date(d.crystallized_at).getTime() <= to);
    }

    // Sort
    switch (sort) {
      case 'recent_first':
        result.sort((a, b) => 
          new Date(b.crystallized_at).getTime() - new Date(a.crystallized_at).getTime()
        );
        break;
      case 'oldest_first':
        result.sort((a, b) => 
          new Date(a.crystallized_at).getTime() - new Date(b.crystallized_at).getTime()
        );
        break;
      case 'by_nature':
        result.sort((a, b) => a.nature.localeCompare(b.nature));
        break;
      case 'by_certainty':
        const certaintyOrder: CertaintyLevel[] = ['certain', 'confident', 'leaning', 'uncertain', 'torn', 'forced'];
        result.sort((a, b) => 
          certaintyOrder.indexOf(a.certainty) - certaintyOrder.indexOf(b.certainty)
        );
        break;
      case 'by_state':
        result.sort((a, b) => a.state.localeCompare(b.state));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [decisions, filters, sort]);

  const addDecision = useCallback((decision: DecisionEntry) => {
    setDecisions(prev => [...prev, decision]);
  }, []);

  const updateDecision = useCallback((id: string, updates: Partial<DecisionEntry>) => {
    setDecisions(prev => prev.map(d => 
      d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d
    ));
  }, []);

  const removeDecision = useCallback((id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  }, []);

  const getDecision = useCallback((id: string) => {
    return decisions.find(d => d.id === id);
  }, [decisions]);

  const getRelatedDecisions = useCallback((id: string) => {
    const decision = decisions.find(d => d.id === id);
    if (!decision) return [];
    return decisions.filter(d => decision.related_decisions.includes(d.id));
  }, [decisions]);

  return {
    decisions,
    filters,
    sort,
    setFilters,
    setSort,
    filteredDecisions,
    addDecision,
    updateDecision,
    removeDecision,
    getDecision,
    getRelatedDecisions
  };
}

// ============================================================================
// useDecision — Single decision CRUD
// ============================================================================

interface UseDecisionReturn {
  decision: DecisionEntry | null;
  isLoading: boolean;
  error: string | null;
  updateState: (state: DecisionState) => void;
  addRevisitation: (revisitation: DecisionRevisitation) => void;
  updateCertainty: (certainty: CertaintyLevel) => void;
  addLinkedEntity: (entity: DecisionLinkedEntity) => void;
  removeLinkedEntity: (entityId: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setReviewReminder: (reminder: DecisionEntry['review_reminder']) => void;
  supersede: (newDecisionId: string) => void;
}

/**
 * useDecision — Manages a single decision
 */
export function useDecision(
  decisionId: string | undefined,
  decisions: DecisionEntry[],
  updateDecision: (id: string, updates: Partial<DecisionEntry>) => void
): UseDecisionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decision = useMemo(() => 
    decisions.find(d => d.id === decisionId) || null,
    [decisions, decisionId]
  );

  const updateState = useCallback((state: DecisionState) => {
    if (!decisionId) return;
    updateDecision(decisionId, { state });
  }, [decisionId, updateDecision]);

  const addRevisitation = useCallback((revisitation: DecisionRevisitation) => {
    if (!decisionId || !decision) return;
    updateDecision(decisionId, {
      revisitations: [...decision.revisitations, revisitation],
      state: 'revisited'
    });
  }, [decisionId, decision, updateDecision]);

  const updateCertainty = useCallback((certainty: CertaintyLevel) => {
    if (!decisionId) return;
    updateDecision(decisionId, { certainty });
  }, [decisionId, updateDecision]);

  const addLinkedEntity = useCallback((entity: DecisionLinkedEntity) => {
    if (!decisionId || !decision) return;
    if (decision.linked_entities.some(e => e.id === entity.id)) return;
    updateDecision(decisionId, {
      linked_entities: [...decision.linked_entities, entity]
    });
  }, [decisionId, decision, updateDecision]);

  const removeLinkedEntity = useCallback((entityId: string) => {
    if (!decisionId || !decision) return;
    updateDecision(decisionId, {
      linked_entities: decision.linked_entities.filter(e => e.id !== entityId)
    });
  }, [decisionId, decision, updateDecision]);

  const addTag = useCallback((tag: string) => {
    if (!decisionId || !decision) return;
    if (decision.tags.includes(tag)) return;
    updateDecision(decisionId, {
      tags: [...decision.tags, tag]
    });
  }, [decisionId, decision, updateDecision]);

  const removeTag = useCallback((tag: string) => {
    if (!decisionId || !decision) return;
    updateDecision(decisionId, {
      tags: decision.tags.filter(t => t !== tag)
    });
  }, [decisionId, decision, updateDecision]);

  const setReviewReminder = useCallback((reminder: DecisionEntry['review_reminder']) => {
    if (!decisionId) return;
    updateDecision(decisionId, { review_reminder: reminder });
  }, [decisionId, updateDecision]);

  const supersede = useCallback((newDecisionId: string) => {
    if (!decisionId) return;
    updateDecision(decisionId, {
      state: 'superseded',
      superseded_by: newDecisionId
    });
  }, [decisionId, updateDecision]);

  return {
    decision,
    isLoading,
    error,
    updateState,
    addRevisitation,
    updateCertainty,
    addLinkedEntity,
    removeLinkedEntity,
    addTag,
    removeTag,
    setReviewReminder,
    supersede
  };
}

// ============================================================================
// useDecisionCreation — Creation flow state
// ============================================================================

interface UseDecisionCreationReturn {
  state: DecisionCreationState;
  isValid: boolean;
  goToStep: (step: DecisionCreationStep) => void;
  setNature: (nature: DecisionNature) => void;
  setTitle: (title: string) => void;
  setStatement: (statement: string) => void;
  setCertainty: (certainty: CertaintyLevel) => void;
  setRationale: (rationale: string) => void;
  setContext: (context: Partial<DecisionContext>) => void;
  addAlternative: (alt: Partial<AlternativeConsidered>) => void;
  updateAlternative: (index: number, alt: Partial<AlternativeConsidered>) => void;
  removeAlternative: (index: number) => void;
  setLinkedEntities: (entities: DecisionLinkedEntity[]) => void;
  setTags: (tags: string[]) => void;
  crystallize: (author: string, authorName: string) => DecisionEntry;
  reset: () => void;
}

const initialCreationState: DecisionCreationState = {
  step: 'nature',
  title: '',
  statement: '',
  context: {
    active_threads: [],
    relevant_meanings: [],
    constraints: [],
    information_available: [],
    information_gaps: [],
    pressures: []
  },
  alternatives: [],
  linked_entities: [],
  tags: [],
  is_valid: false,
  errors: {}
};

/**
 * useDecisionCreation — Manages decision creation flow
 */
export function useDecisionCreation(): UseDecisionCreationReturn {
  const [state, setState] = useState<DecisionCreationState>(initialCreationState);

  // Validate state
  const isValid = useMemo(() => {
    // Statement is required
    return state.statement.trim().length > 0;
  }, [state.statement]);

  // Update state with validation
  useEffect(() => {
    setState(prev => ({
      ...prev,
      is_valid: isValid,
      errors: isValid ? {} : { statement: 'A decision statement is required' }
    }));
  }, [isValid]);

  const goToStep = useCallback((step: DecisionCreationStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const setNature = useCallback((nature: DecisionNature) => {
    setState(prev => ({ ...prev, nature }));
  }, []);

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }));
  }, []);

  const setStatement = useCallback((statement: string) => {
    setState(prev => ({ ...prev, statement }));
  }, []);

  const setCertainty = useCallback((certainty: CertaintyLevel) => {
    setState(prev => ({ ...prev, certainty }));
  }, []);

  const setRationale = useCallback((rationale: string) => {
    setState(prev => ({ ...prev, rationale }));
  }, []);

  const setContext = useCallback((context: Partial<DecisionContext>) => {
    setState(prev => ({
      ...prev,
      context: { ...prev.context, ...context }
    }));
  }, []);

  const addAlternative = useCallback((alt: Partial<AlternativeConsidered>) => {
    setState(prev => ({
      ...prev,
      alternatives: [
        ...prev.alternatives,
        {
          id: crypto.randomUUID(),
          consideration_order: prev.alternatives.length + 1,
          ...alt
        }
      ]
    }));
  }, []);

  const updateAlternative = useCallback((index: number, alt: Partial<AlternativeConsidered>) => {
    setState(prev => ({
      ...prev,
      alternatives: prev.alternatives.map((a, i) => 
        i === index ? { ...a, ...alt } : a
      )
    }));
  }, []);

  const removeAlternative = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      alternatives: prev.alternatives.filter((_, i) => i !== index)
    }));
  }, []);

  const setLinkedEntities = useCallback((entities: DecisionLinkedEntity[]) => {
    setState(prev => ({ ...prev, linked_entities: entities }));
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setState(prev => ({ ...prev, tags }));
  }, []);

  const crystallize = useCallback((author: string, authorName: string): DecisionEntry => {
    const now = new Date().toISOString();
    
    const decision: DecisionEntry = {
      id: crypto.randomUUID(),
      author,
      author_name: authorName,
      crystallized_at: now,
      updated_at: now,
      title: state.title || 'Untitled Decision',
      statement: state.statement,
      rationale: state.rationale,
      nature: state.nature || 'unknown',
      certainty: state.certainty || 'uncertain',
      state: 'crystallized',
      context: state.context as DecisionContext,
      alternatives: state.alternatives.filter(a => a.description) as AlternativeConsidered[],
      linked_entities: state.linked_entities,
      related_decisions: [],
      revisitations: [],
      tags: state.tags,
      review_reminder: state.review_reminder as DecisionEntry['review_reminder']
    };

    return decision;
  }, [state]);

  const reset = useCallback(() => {
    setState(initialCreationState);
  }, []);

  return {
    state,
    isValid,
    goToStep,
    setNature,
    setTitle,
    setStatement,
    setCertainty,
    setRationale,
    setContext,
    addAlternative,
    updateAlternative,
    removeAlternative,
    setLinkedEntities,
    setTags,
    crystallize,
    reset
  };
}

// ============================================================================
// useEmergingDecisions — Pre-crystallization decisions
// ============================================================================

interface UseEmergingDecisionsReturn {
  emerging: EmergingDecision[];
  addEmerging: (decision: Omit<EmergingDecision, 'id' | 'emerged_at' | 'crystallized'>) => string;
  updateEmerging: (id: string, updates: Partial<EmergingDecision>) => void;
  removeEmerging: (id: string) => void;
  crystallizeEmerging: (id: string, author: string, authorName: string) => DecisionEntry | null;
  addOption: (id: string, option: string) => void;
  removeOption: (id: string, optionIndex: number) => void;
  addQuestion: (id: string, question: string) => void;
  removeQuestion: (id: string, questionIndex: number) => void;
}

/**
 * useEmergingDecisions — Manages decisions still forming
 */
export function useEmergingDecisions(): UseEmergingDecisionsReturn {
  const [emerging, setEmerging] = useState<EmergingDecision[]>([]);

  const addEmerging = useCallback((
    decision: Omit<EmergingDecision, 'id' | 'emerged_at' | 'crystallized'>
  ): string => {
    const id = crypto.randomUUID();
    const newEmerging: EmergingDecision = {
      ...decision,
      id,
      emerged_at: new Date().toISOString(),
      crystallized: false
    };
    setEmerging(prev => [...prev, newEmerging]);
    return id;
  }, []);

  const updateEmerging = useCallback((id: string, updates: Partial<EmergingDecision>) => {
    setEmerging(prev => prev.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
  }, []);

  const removeEmerging = useCallback((id: string) => {
    setEmerging(prev => prev.filter(e => e.id !== id));
  }, []);

  const crystallizeEmerging = useCallback((
    id: string,
    author: string,
    authorName: string
  ): DecisionEntry | null => {
    const emergingDecision = emerging.find(e => e.id === id);
    if (!emergingDecision) return null;

    const now = new Date().toISOString();
    const decision: DecisionEntry = {
      id: crypto.randomUUID(),
      author,
      author_name: authorName,
      crystallized_at: now,
      updated_at: now,
      title: emergingDecision.working_title,
      statement: emergingDecision.current_thinking || '',
      nature: emergingDecision.tentative_nature || 'unknown',
      certainty: 'uncertain',
      state: 'crystallized',
      context: {
        active_threads: [],
        relevant_meanings: [],
        constraints: [],
        information_available: [],
        information_gaps: emergingDecision.open_questions,
        pressures: []
      },
      alternatives: emergingDecision.options.map((opt, idx) => ({
        id: crypto.randomUUID(),
        description: opt,
        consideration_order: idx + 1
      })),
      linked_entities: emergingDecision.linked_entities,
      related_decisions: [],
      revisitations: [],
      tags: []
    };

    // Mark as crystallized
    setEmerging(prev => prev.map(e => 
      e.id === id ? { ...e, crystallized: true, crystallized_as: decision.id } : e
    ));

    return decision;
  }, [emerging]);

  const addOption = useCallback((id: string, option: string) => {
    setEmerging(prev => prev.map(e => 
      e.id === id ? { ...e, options: [...e.options, option] } : e
    ));
  }, []);

  const removeOption = useCallback((id: string, optionIndex: number) => {
    setEmerging(prev => prev.map(e => 
      e.id === id ? { ...e, options: e.options.filter((_, i) => i !== optionIndex) } : e
    ));
  }, []);

  const addQuestion = useCallback((id: string, question: string) => {
    setEmerging(prev => prev.map(e => 
      e.id === id ? { ...e, open_questions: [...e.open_questions, question] } : e
    ));
  }, []);

  const removeQuestion = useCallback((id: string, questionIndex: number) => {
    setEmerging(prev => prev.map(e => 
      e.id === id ? { ...e, open_questions: e.open_questions.filter((_, i) => i !== questionIndex) } : e
    ));
  }, []);

  return {
    emerging,
    addEmerging,
    updateEmerging,
    removeEmerging,
    crystallizeEmerging,
    addOption,
    removeOption,
    addQuestion,
    removeQuestion
  };
}

// ============================================================================
// useDecisionDrift — Drift detection
// ============================================================================

interface UseDecisionDriftReturn {
  drifts: DecisionDrift[];
  detectDrift: (
    decisionId: string,
    trigger: DecisionDriftTrigger,
    description: string
  ) => void;
  acknowledgeDrift: (decisionId: string, response?: string) => void;
  dismissDrift: (decisionId: string) => void;
  resolveDrift: (decisionId: string, resolution: string) => void;
  unacknowledgedDrifts: DecisionDrift[];
}

/**
 * useDecisionDrift — Manages drift detection and handling
 * 
 * Drift is noticed, not judged.
 * Human decides what to do with it.
 */
export function useDecisionDrift(): UseDecisionDriftReturn {
  const [drifts, setDrifts] = useState<DecisionDrift[]>([]);

  const detectDrift = useCallback((
    decisionId: string,
    trigger: DecisionDriftTrigger,
    description: string
  ) => {
    // Check if drift already exists for this decision
    if (drifts.some(d => d.decision_id === decisionId && d.status === 'unacknowledged')) {
      return; // Don't pile up notices
    }

    const newDrift: DecisionDrift = {
      decision_id: decisionId,
      detected_at: new Date().toISOString(),
      trigger,
      description,
      status: 'unacknowledged'
    };

    setDrifts(prev => [...prev, newDrift]);
  }, [drifts]);

  const acknowledgeDrift = useCallback((decisionId: string, response?: string) => {
    setDrifts(prev => prev.map(d => 
      d.decision_id === decisionId && d.status === 'unacknowledged'
        ? { ...d, status: 'acknowledged', response }
        : d
    ));
  }, []);

  const dismissDrift = useCallback((decisionId: string) => {
    setDrifts(prev => prev.map(d => 
      d.decision_id === decisionId && d.status === 'unacknowledged'
        ? { ...d, status: 'dismissed' }
        : d
    ));
  }, []);

  const resolveDrift = useCallback((decisionId: string, resolution: string) => {
    setDrifts(prev => prev.map(d => 
      d.decision_id === decisionId
        ? { ...d, status: 'resolved', response: resolution }
        : d
    ));
  }, []);

  const unacknowledgedDrifts = useMemo(() => 
    drifts.filter(d => d.status === 'unacknowledged'),
    [drifts]
  );

  return {
    drifts,
    detectDrift,
    acknowledgeDrift,
    dismissDrift,
    resolveDrift,
    unacknowledgedDrifts
  };
}

// ============================================================================
// useDecisionCrystallizerUI — UI state management
// ============================================================================

interface UseDecisionCrystallizerUIReturn {
  uiState: DecisionCrystallizerUIState;
  setView: (view: DecisionCrystallizerUIState['view']) => void;
  selectDecision: (id: string) => void;
  clearSelection: () => void;
  setFilters: (filters: DecisionFilters) => void;
  setSort: (sort: DecisionSortOption) => void;
  toggleEmerging: () => void;
  toggleDriftNotices: () => void;
  toggleSection: (section: string) => void;
  isSectionExpanded: (section: string) => boolean;
}

const initialUIState: DecisionCrystallizerUIState = {
  view: 'list',
  filters: {},
  sort: 'recent_first',
  expanded_sections: [],
  show_emerging: false,
  show_drift_notices: true
};

/**
 * useDecisionCrystallizerUI — Manages UI state for the crystallizer
 */
export function useDecisionCrystallizerUI(): UseDecisionCrystallizerUIReturn {
  const [uiState, setUIState] = useState<DecisionCrystallizerUIState>(initialUIState);

  const setView = useCallback((view: DecisionCrystallizerUIState['view']) => {
    setUIState(prev => ({ ...prev, view }));
  }, []);

  const selectDecision = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      view: 'detail',
      selected_decision_id: id
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      view: 'list',
      selected_decision_id: undefined
    }));
  }, []);

  const setFilters = useCallback((filters: DecisionFilters) => {
    setUIState(prev => ({ ...prev, filters }));
  }, []);

  const setSort = useCallback((sort: DecisionSortOption) => {
    setUIState(prev => ({ ...prev, sort }));
  }, []);

  const toggleEmerging = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      show_emerging: !prev.show_emerging,
      view: prev.show_emerging ? 'list' : 'emerging'
    }));
  }, []);

  const toggleDriftNotices = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      show_drift_notices: !prev.show_drift_notices
    }));
  }, []);

  const toggleSection = useCallback((section: string) => {
    setUIState(prev => ({
      ...prev,
      expanded_sections: prev.expanded_sections.includes(section)
        ? prev.expanded_sections.filter(s => s !== section)
        : [...prev.expanded_sections, section]
    }));
  }, []);

  const isSectionExpanded = useCallback((section: string) => {
    return uiState.expanded_sections.includes(section);
  }, [uiState.expanded_sections]);

  return {
    uiState,
    setView,
    selectDecision,
    clearSelection,
    setFilters,
    setSort,
    toggleEmerging,
    toggleDriftNotices,
    toggleSection,
    isSectionExpanded
  };
}

// ============================================================================
// useDecisionPrivacy — Privacy settings management
// ============================================================================

interface UseDecisionPrivacyReturn {
  settings: DecisionPrivacySettings;
  updateSettings: (updates: Partial<DecisionPrivacySettings>) => void;
  resetToDefaults: () => void;
}

/**
 * useDecisionPrivacy — Manages privacy settings for decisions
 */
export function useDecisionPrivacy(): UseDecisionPrivacyReturn {
  const [settings, setSettings] = useState<DecisionPrivacySettings>(DEFAULT_DECISION_PRIVACY);

  const updateSettings = useCallback((updates: Partial<DecisionPrivacySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_DECISION_PRIVACY);
  }, []);

  return {
    settings,
    updateSettings,
    resetToDefaults
  };
}

// ============================================================================
// useDecisionReview — Review reminder management
// ============================================================================

interface UseDecisionReviewReturn {
  dueForReview: DecisionEntry[];
  checkReminders: (decisions: DecisionEntry[]) => DecisionEntry[];
  triggerReminder: (decisionId: string) => void;
  dismissReminder: (decisionId: string) => void;
  snoozeReminder: (decisionId: string, until: string) => void;
}

/**
 * useDecisionReview — Manages review reminders
 */
export function useDecisionReview(
  decisions: DecisionEntry[],
  updateDecision: (id: string, updates: Partial<DecisionEntry>) => void
): UseDecisionReviewReturn {
  const dueForReview = useMemo(() => {
    const now = new Date().getTime();
    return decisions.filter(d => {
      if (!d.review_reminder) return false;
      if (d.review_reminder.triggered || d.review_reminder.dismissed) return false;
      return new Date(d.review_reminder.remind_at).getTime() <= now;
    });
  }, [decisions]);

  const checkReminders = useCallback((decisionsToCheck: DecisionEntry[]) => {
    const now = new Date().getTime();
    return decisionsToCheck.filter(d => {
      if (!d.review_reminder) return false;
      if (d.review_reminder.triggered || d.review_reminder.dismissed) return false;
      return new Date(d.review_reminder.remind_at).getTime() <= now;
    });
  }, []);

  const triggerReminder = useCallback((decisionId: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision?.review_reminder) return;
    
    updateDecision(decisionId, {
      review_reminder: {
        ...decision.review_reminder,
        triggered: true
      }
    });
  }, [decisions, updateDecision]);

  const dismissReminder = useCallback((decisionId: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision?.review_reminder) return;
    
    updateDecision(decisionId, {
      review_reminder: {
        ...decision.review_reminder,
        dismissed: true
      }
    });
  }, [decisions, updateDecision]);

  const snoozeReminder = useCallback((decisionId: string, until: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision?.review_reminder) return;
    
    updateDecision(decisionId, {
      review_reminder: {
        ...decision.review_reminder,
        remind_at: until,
        triggered: false
      }
    });
  }, [decisions, updateDecision]);

  return {
    dueForReview,
    checkReminders,
    triggerReminder,
    dismissReminder,
    snoozeReminder
  };
}

// ============================================================================
// useDecisionSearch — Search decisions
// ============================================================================

interface UseDecisionSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: DecisionEntry[];
  isSearching: boolean;
}

/**
 * useDecisionSearch — Search through decisions
 */
export function useDecisionSearch(decisions: DecisionEntry[]): UseDecisionSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    setIsSearching(true);
    const search = query.toLowerCase();
    
    const filtered = decisions.filter(d =>
      d.title.toLowerCase().includes(search) ||
      d.statement.toLowerCase().includes(search) ||
      d.rationale?.toLowerCase().includes(search) ||
      d.tags.some(t => t.toLowerCase().includes(search)) ||
      d.context.notes?.toLowerCase().includes(search)
    );
    
    setIsSearching(false);
    return filtered;
  }, [decisions, query]);

  return {
    query,
    setQuery,
    results,
    isSearching
  };
}

// ============================================================================
// useLinkedDecisions — Get decisions linked to an entity
// ============================================================================

interface UseLinkedDecisionsReturn {
  linkedDecisions: DecisionEntry[];
  hasDecisions: boolean;
  count: number;
}

/**
 * useLinkedDecisions — Find decisions linked to a specific entity
 */
export function useLinkedDecisions(
  decisions: DecisionEntry[],
  entityType: string,
  entityId: string
): UseLinkedDecisionsReturn {
  const linkedDecisions = useMemo(() => 
    decisions.filter(d => 
      d.linked_entities.some(e => e.type === entityType && e.id === entityId)
    ),
    [decisions, entityType, entityId]
  );

  return {
    linkedDecisions,
    hasDecisions: linkedDecisions.length > 0,
    count: linkedDecisions.length
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  useDecisions,
  useDecision,
  useDecisionCreation,
  useEmergingDecisions,
  useDecisionDrift,
  useDecisionCrystallizerUI,
  useDecisionPrivacy,
  useDecisionReview,
  useDecisionSearch,
  useLinkedDecisions
};

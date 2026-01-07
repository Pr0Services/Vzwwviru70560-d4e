/**
 * CHE·NU™ XR SPACE BUILDER UI — HOOKS
 * 
 * Custom hooks for the XR Space Builder interface.
 * Handles creation flow, validation, primitives, and agent interaction.
 * 
 * @version 1.0
 * @status V51-ready
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  XRSpace,
  XRZone,
  XRPrimitive,
  XRPrimitiveType,
  XRPrimitiveParameters,
  PrimitiveConnection,
  CreationStep,
  CreationMode,
  CreationFlowState,
  SpaceDeclaration,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SafetyViolation,
  BuilderSafetyGuarantees,
  SpaceOverviewPanel,
  PrimitivePalettePanel,
  SemanticConfigPanel,
  ValidationPanel,
  PreviewPanel,
  PreviewMode,
  ArchitectAgentMessage,
  SpaceVersion,
  SemanticChange,
  XRSpaceTemplate,
  ValidateSpaceResponse,
} from './xr-space-builder.types';
import {
  DEFAULT_SAFETY_GUARANTEES,
  PRIMITIVE_DEFINITIONS,
  CREATION_STEPS_ORDER,
  XR_SPACE_BUILDER_TOKENS,
} from './xr-space-builder.types';

// ═══════════════════════════════════════════════════════════════════════════════
// CREATION FLOW HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseCreationFlowOptions {
  initial_mode?: CreationMode;
  template_id?: string;
  clone_from_id?: string;
  onStepChange?: (step: CreationStep) => void;
}

export interface UseCreationFlowReturn {
  state: CreationFlowState;
  currentStep: CreationStep;
  canProceed: boolean;
  canGoBack: boolean;
  setMode: (mode: CreationMode) => void;
  setDeclaration: (declaration: SpaceDeclaration) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: CreationStep) => void;
  completeStep: (step: CreationStep) => void;
  reset: () => void;
}

export function useCreationFlow(options: UseCreationFlowOptions = {}): UseCreationFlowReturn {
  const { initial_mode, onStepChange } = options;
  
  const [state, setState] = useState<CreationFlowState>({
    current_step: 'select_mode',
    mode: initial_mode,
    primitives_placed: [],
    validation_passed: false,
    preview_completed: false,
    ready_to_publish: false,
    completed_steps: initial_mode ? ['select_mode'] : [],
    remaining_steps: initial_mode 
      ? CREATION_STEPS_ORDER.slice(1)
      : [...CREATION_STEPS_ORDER],
  });
  
  const currentStepIndex = CREATION_STEPS_ORDER.indexOf(state.current_step);
  
  const canProceed = useMemo(() => {
    switch (state.current_step) {
      case 'select_mode':
        return !!state.mode;
      case 'declare_purpose':
        return !!state.declaration?.purpose && !!state.declaration?.meaning;
      case 'place_primitives':
        return state.primitives_placed.length > 0;
      case 'validate':
        return state.validation_passed;
      case 'preview':
        return state.preview_completed;
      case 'confirm':
        return state.ready_to_publish;
      default:
        return false;
    }
  }, [state]);
  
  const canGoBack = currentStepIndex > 0;
  
  const setMode = useCallback((mode: CreationMode) => {
    setState(prev => ({
      ...prev,
      mode,
      completed_steps: prev.completed_steps.includes('select_mode')
        ? prev.completed_steps
        : [...prev.completed_steps, 'select_mode'],
    }));
  }, []);
  
  const setDeclaration = useCallback((declaration: SpaceDeclaration) => {
    setState(prev => ({
      ...prev,
      declaration,
    }));
  }, []);
  
  const nextStep = useCallback(() => {
    if (!canProceed) return;
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= CREATION_STEPS_ORDER.length) return;
    
    const nextStepName = CREATION_STEPS_ORDER[nextIndex];
    
    setState(prev => ({
      ...prev,
      current_step: nextStepName,
      completed_steps: prev.completed_steps.includes(prev.current_step)
        ? prev.completed_steps
        : [...prev.completed_steps, prev.current_step],
      remaining_steps: CREATION_STEPS_ORDER.slice(nextIndex),
    }));
    
    onStepChange?.(nextStepName);
  }, [canProceed, currentStepIndex, onStepChange]);
  
  const previousStep = useCallback(() => {
    if (!canGoBack) return;
    
    const prevIndex = currentStepIndex - 1;
    const prevStepName = CREATION_STEPS_ORDER[prevIndex];
    
    setState(prev => ({
      ...prev,
      current_step: prevStepName,
      remaining_steps: CREATION_STEPS_ORDER.slice(prevIndex),
    }));
    
    onStepChange?.(prevStepName);
  }, [canGoBack, currentStepIndex, onStepChange]);
  
  const goToStep = useCallback((step: CreationStep) => {
    const stepIndex = CREATION_STEPS_ORDER.indexOf(step);
    if (stepIndex === -1) return;
    
    // Can only go to completed steps or current step
    if (!state.completed_steps.includes(step) && step !== state.current_step) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      current_step: step,
      remaining_steps: CREATION_STEPS_ORDER.slice(stepIndex),
    }));
    
    onStepChange?.(step);
  }, [state.completed_steps, state.current_step, onStepChange]);
  
  const completeStep = useCallback((step: CreationStep) => {
    setState(prev => ({
      ...prev,
      completed_steps: prev.completed_steps.includes(step)
        ? prev.completed_steps
        : [...prev.completed_steps, step],
    }));
  }, []);
  
  const reset = useCallback(() => {
    setState({
      current_step: 'select_mode',
      mode: undefined,
      declaration: undefined,
      primitives_placed: [],
      validation_passed: false,
      preview_completed: false,
      ready_to_publish: false,
      completed_steps: [],
      remaining_steps: [...CREATION_STEPS_ORDER],
    });
    
    onStepChange?.('select_mode');
  }, [onStepChange]);
  
  return {
    state,
    currentStep: state.current_step,
    canProceed,
    canGoBack,
    setMode,
    setDeclaration,
    nextStep,
    previousStep,
    goToStep,
    completeStep,
    reset,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACE MANAGEMENT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseSpaceOptions {
  space_id?: string;
  user_id: string;
  onSpaceCreated?: (space: XRSpace) => void;
  onSpaceUpdated?: (space: XRSpace) => void;
}

export interface UseSpaceReturn {
  space: XRSpace | null;
  zones: XRZone[];
  primitives: XRPrimitive[];
  connections: PrimitiveConnection[];
  isLoading: boolean;
  error: string | null;
  createSpace: (declaration: SpaceDeclaration, mode: CreationMode) => Promise<XRSpace>;
  addZone: (zone: Omit<XRZone, 'id'>) => void;
  removeZone: (zoneId: string) => void;
  updateZone: (zoneId: string, updates: Partial<XRZone>) => void;
  addPrimitive: (primitive: Omit<XRPrimitive, 'id'>, zoneId?: string) => void;
  removePrimitive: (primitiveId: string) => void;
  updatePrimitive: (primitiveId: string, updates: Partial<XRPrimitive>) => void;
  addConnection: (connection: Omit<PrimitiveConnection, 'id'>) => void;
  removeConnection: (connectionId: string) => void;
  saveSpace: () => Promise<void>;
}

export function useSpace(options: UseSpaceOptions): UseSpaceReturn {
  const { space_id, user_id, onSpaceCreated, onSpaceUpdated } = options;
  
  const [space, setSpace] = useState<XRSpace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate unique ID
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  
  // Create new space
  const createSpace = useCallback(async (
    declaration: SpaceDeclaration,
    mode: CreationMode
  ): Promise<XRSpace> => {
    const newSpace: XRSpace = {
      id: generateId(),
      name: declaration.purpose,
      declaration,
      zones: [],
      primitives: [],
      connections: [],
      versioning: {
        current_version: '1.0.0',
        version_timeline: [],
        semantic_diff_available: true,
        rollback_available: true,
      },
      safety_status: {
        is_safe: true,
        last_validated: new Date().toISOString(),
        violations: [],
        guarantees_met: { ...DEFAULT_SAFETY_GUARANTEES },
      },
      created_by: user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_published: false,
    };
    
    setSpace(newSpace);
    onSpaceCreated?.(newSpace);
    
    return newSpace;
  }, [generateId, user_id, onSpaceCreated]);
  
  // Zone operations
  const addZone = useCallback((zone: Omit<XRZone, 'id'>) => {
    if (!space) return;
    
    const newZone: XRZone = {
      ...zone,
      id: generateId(),
    };
    
    const updated = {
      ...space,
      zones: [...space.zones, newZone],
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, generateId, onSpaceUpdated]);
  
  const removeZone = useCallback((zoneId: string) => {
    if (!space) return;
    
    const updated = {
      ...space,
      zones: space.zones.filter(z => z.id !== zoneId),
      // Also remove zone reference from primitives
      primitives: space.primitives.map(p => ({
        ...p,
        // Remove zone reference if primitive was in this zone
      })),
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, onSpaceUpdated]);
  
  const updateZone = useCallback((zoneId: string, updates: Partial<XRZone>) => {
    if (!space) return;
    
    const updated = {
      ...space,
      zones: space.zones.map(z => 
        z.id === zoneId ? { ...z, ...updates } : z
      ),
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, onSpaceUpdated]);
  
  // Primitive operations
  const addPrimitive = useCallback((
    primitive: Omit<XRPrimitive, 'id'>,
    zoneId?: string
  ) => {
    if (!space) return;
    
    const newPrimitive: XRPrimitive = {
      ...primitive,
      id: generateId(),
    };
    
    let updatedZones = space.zones;
    if (zoneId) {
      updatedZones = space.zones.map(z => 
        z.id === zoneId
          ? { ...z, primitives: [...z.primitives, newPrimitive.id] }
          : z
      );
    }
    
    const updated = {
      ...space,
      primitives: [...space.primitives, newPrimitive],
      zones: updatedZones,
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, generateId, onSpaceUpdated]);
  
  const removePrimitive = useCallback((primitiveId: string) => {
    if (!space) return;
    
    const updated = {
      ...space,
      primitives: space.primitives.filter(p => p.id !== primitiveId),
      zones: space.zones.map(z => ({
        ...z,
        primitives: z.primitives.filter(id => id !== primitiveId),
      })),
      connections: space.connections.filter(
        c => c.from_primitive !== primitiveId && c.to_primitive !== primitiveId
      ),
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, onSpaceUpdated]);
  
  const updatePrimitive = useCallback((
    primitiveId: string,
    updates: Partial<XRPrimitive>
  ) => {
    if (!space) return;
    
    const updated = {
      ...space,
      primitives: space.primitives.map(p =>
        p.id === primitiveId ? { ...p, ...updates } : p
      ),
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, onSpaceUpdated]);
  
  // Connection operations
  const addConnection = useCallback((connection: Omit<PrimitiveConnection, 'id'>) => {
    if (!space) return;
    
    const newConnection: PrimitiveConnection = {
      ...connection,
      id: generateId(),
    };
    
    const updated = {
      ...space,
      connections: [...space.connections, newConnection],
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, generateId, onSpaceUpdated]);
  
  const removeConnection = useCallback((connectionId: string) => {
    if (!space) return;
    
    const updated = {
      ...space,
      connections: space.connections.filter(c => c.id !== connectionId),
      updated_at: new Date().toISOString(),
    };
    
    setSpace(updated);
    onSpaceUpdated?.(updated);
  }, [space, onSpaceUpdated]);
  
  // Save space
  const saveSpace = useCallback(async () => {
    if (!space) return;
    
    setIsLoading(true);
    try {
      // API call would go here
      logger.debug('Saving space:', space);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  }, [space]);
  
  return {
    space,
    zones: space?.zones ?? [],
    primitives: space?.primitives ?? [],
    connections: space?.connections ?? [],
    isLoading,
    error,
    createSpace,
    addZone,
    removeZone,
    updateZone,
    addPrimitive,
    removePrimitive,
    updatePrimitive,
    addConnection,
    removeConnection,
    saveSpace,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseValidationOptions {
  space: XRSpace | null;
  continuous?: boolean;
  onValidationChange?: (result: ValidateSpaceResponse) => void;
}

export interface UseValidationReturn {
  isValid: boolean;
  isSafe: boolean;
  validations: ValidationResult[];
  errors: ValidationError[];
  warnings: ValidationWarning[];
  safetyViolations: SafetyViolation[];
  validate: () => ValidateSpaceResponse;
  checkSafety: () => SafetyViolation[];
  getErrorsForElement: (elementId: string) => ValidationError[];
}

export function useValidation(options: UseValidationOptions): UseValidationReturn {
  const { space, continuous = true, onValidationChange } = options;
  
  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [safetyViolations, setSafetyViolations] = useState<SafetyViolation[]>([]);
  
  // Check safety guarantees
  const checkSafety = useCallback((): SafetyViolation[] => {
    if (!space) return [];
    
    const violations: SafetyViolation[] = [];
    
    // Check: no_hidden_areas
    // (Would check space geometry for hidden areas)
    
    // Check: no_forced_perspective
    // (Would check for perspective manipulation)
    
    // Check: no_urgency_encoding
    const hasUrgency = space.primitives.some(p => 
      p.parameters.visibility === 'contextual' &&
      (p.meaning?.toLowerCase().includes('urgent') ||
       p.meaning?.toLowerCase().includes('hurry'))
    );
    if (hasUrgency) {
      violations.push({
        id: `safety-urgency-${Date.now()}`,
        guarantee_violated: 'no_urgency_encoding',
        description: 'Space contains urgency signals',
        severity: 'high',
        blocks_progress: true,
        why_dangerous: 'Urgency encoding manipulates user decision-making',
        resolution: 'Remove urgency-related elements or rephrase meaning',
      });
    }
    
    // Check: exit_always_visible
    const hasExit = space.primitives.some(p => 
      p.type === 'boundary' && 
      p.parameters.purpose?.toLowerCase().includes('exit')
    );
    if (!hasExit && space.primitives.length > 0) {
      violations.push({
        id: `safety-exit-${Date.now()}`,
        guarantee_violated: 'exit_always_visible',
        description: 'No exit point defined',
        severity: 'critical',
        blocks_progress: true,
        why_dangerous: 'Users must always be able to leave',
        resolution: 'Add a boundary primitive with exit purpose',
      });
    }
    
    return violations;
  }, [space]);
  
  // Full validation
  const validate = useCallback((): ValidateSpaceResponse => {
    if (!space) {
      return {
        is_valid: false,
        validations: [],
        errors: [{
          id: 'no-space',
          rule_violated: 'space_required',
          message: 'No space to validate',
          why_blocked: 'A space must be created first',
          how_to_fix: 'Create a space with declaration',
        }],
        warnings: [],
        safety_violations: [],
      };
    }
    
    const newValidations: ValidationResult[] = [];
    const newErrors: ValidationError[] = [];
    const newWarnings: ValidationWarning[] = [];
    
    // Validate declaration
    if (!space.declaration.purpose) {
      newErrors.push({
        id: 'missing-purpose',
        rule_violated: 'declaration_required',
        message: 'Space purpose is required',
        why_blocked: 'Every space must declare its purpose',
        how_to_fix: 'Add a purpose in the declaration step',
      });
    } else {
      newValidations.push({
        rule_id: 'declaration_purpose',
        rule_name: 'Purpose Declaration',
        status: 'pass',
        message: 'Purpose is declared',
        explanation: 'Spaces must have clear purpose',
      });
    }
    
    if (!space.declaration.meaning) {
      newErrors.push({
        id: 'missing-meaning',
        rule_violated: 'meaning_required',
        message: 'Space meaning is required',
        why_blocked: 'Every space must declare its meaning',
        how_to_fix: 'Add meaning in the declaration step',
      });
    } else {
      newValidations.push({
        rule_id: 'declaration_meaning',
        rule_name: 'Meaning Declaration',
        status: 'pass',
        message: 'Meaning is declared',
        explanation: 'Spaces must have clear meaning',
      });
    }
    
    // Validate primitives
    space.primitives.forEach(primitive => {
      if (!primitive.meaning) {
        newWarnings.push({
          id: `primitive-meaning-${primitive.id}`,
          rule_id: 'primitive_meaning',
          element_id: primitive.id,
          message: `Primitive "${primitive.type}" has no meaning`,
          suggestion: 'Add semantic meaning to this primitive',
        });
      }
    });
    
    // Check safety
    const safety = checkSafety();
    
    // Combine results
    const result: ValidateSpaceResponse = {
      is_valid: newErrors.length === 0 && safety.length === 0,
      validations: newValidations,
      errors: newErrors,
      warnings: newWarnings,
      safety_violations: safety,
    };
    
    setValidations(newValidations);
    setErrors(newErrors);
    setWarnings(newWarnings);
    setSafetyViolations(safety);
    
    onValidationChange?.(result);
    
    return result;
  }, [space, checkSafety, onValidationChange]);
  
  // Continuous validation
  useEffect(() => {
    if (continuous && space) {
      validate();
    }
  }, [continuous, space, validate]);
  
  // Get errors for specific element
  const getErrorsForElement = useCallback((elementId: string): ValidationError[] => {
    return errors.filter(e => e.element_id === elementId);
  }, [errors]);
  
  const isValid = errors.length === 0 && safetyViolations.length === 0;
  const isSafe = safetyViolations.length === 0;
  
  return {
    isValid,
    isSafe,
    validations,
    errors,
    warnings,
    safetyViolations,
    validate,
    checkSafety,
    getErrorsForElement,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVE PALETTE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePrimitivePaletteOptions {
  space: XRSpace | null;
  onSelect?: (type: XRPrimitiveType) => void;
}

export interface UsePrimitivePaletteReturn {
  palette: PrimitivePalettePanel;
  selectedType: XRPrimitiveType | null;
  select: (type: XRPrimitiveType) => void;
  deselect: () => void;
  getPrimitiveInfo: (type: XRPrimitiveType) => typeof PRIMITIVE_DEFINITIONS[0] | undefined;
}

export function usePrimitivePalette(options: UsePrimitivePaletteOptions): UsePrimitivePaletteReturn {
  const { onSelect } = options;
  
  const [selectedType, setSelectedType] = useState<XRPrimitiveType | null>(null);
  
  const palette: PrimitivePalettePanel = useMemo(() => ({
    position: 'left_lower',
    primitives: PRIMITIVE_DEFINITIONS,
    selected: selectedType ?? undefined,
  }), [selectedType]);
  
  const select = useCallback((type: XRPrimitiveType) => {
    setSelectedType(type);
    onSelect?.(type);
  }, [onSelect]);
  
  const deselect = useCallback(() => {
    setSelectedType(null);
  }, []);
  
  const getPrimitiveInfo = useCallback((type: XRPrimitiveType) => {
    return PRIMITIVE_DEFINITIONS.find(p => p.type === type);
  }, []);
  
  return {
    palette,
    selectedType,
    select,
    deselect,
    getPrimitiveInfo,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREVIEW HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePreviewOptions {
  space: XRSpace | null;
  onPreviewComplete?: () => void;
}

export interface UsePreviewReturn {
  panel: PreviewPanel;
  isPreviewing: boolean;
  mode: PreviewMode;
  startPreview: (mode?: PreviewMode) => void;
  stopPreview: () => void;
  setMode: (mode: PreviewMode) => void;
  toggleOverlay: (overlay: 'cognitive_load' | 'meaning_layer') => void;
  markComplete: () => void;
}

export function usePreview(options: UsePreviewOptions): UsePreviewReturn {
  const { space, onPreviewComplete } = options;
  
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [mode, setMode] = useState<PreviewMode>('static');
  const [overlays, setOverlays] = useState<{
    cognitive_load: boolean;
    meaning_layer: boolean;
  }>({
    cognitive_load: false,
    meaning_layer: false,
  });
  
  const panel: PreviewPanel = useMemo(() => ({
    position: 'bottom',
    mode,
    simulations: [
      { id: 'user', name: 'User View', description: 'Experience as user', enabled: true },
      { id: 'observer', name: 'Observer View', description: 'Third-person view', enabled: true },
      { id: 'cognitive', name: 'Cognitive Load', description: 'Show load overlay', enabled: true },
      { id: 'meaning', name: 'Meaning Layer', description: 'Show meaning overlay', enabled: true },
    ],
    state: {
      is_previewing: isPreviewing,
      active_overlays: [
        ...(overlays.cognitive_load ? ['cognitive_load'] : []),
        ...(overlays.meaning_layer ? ['meaning_layer'] : []),
      ],
      cognitive_load_visible: overlays.cognitive_load,
      meaning_layer_visible: overlays.meaning_layer,
    },
  }), [mode, isPreviewing, overlays]);
  
  const startPreview = useCallback((previewMode?: PreviewMode) => {
    if (!space) return;
    setIsPreviewing(true);
    if (previewMode) setMode(previewMode);
  }, [space]);
  
  const stopPreview = useCallback(() => {
    setIsPreviewing(false);
  }, []);
  
  const toggleOverlay = useCallback((overlay: 'cognitive_load' | 'meaning_layer') => {
    setOverlays(prev => ({
      ...prev,
      [overlay]: !prev[overlay],
    }));
  }, []);
  
  const markComplete = useCallback(() => {
    onPreviewComplete?.();
  }, [onPreviewComplete]);
  
  return {
    panel,
    isPreviewing,
    mode,
    startPreview,
    stopPreview,
    setMode,
    toggleOverlay,
    markComplete,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECT AGENT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseArchitectAgentOptions {
  enabled?: boolean;
  space: XRSpace | null;
  validationErrors: ValidationError[];
  safetyViolations: SafetyViolation[];
}

export interface UseArchitectAgentReturn {
  messages: ArchitectAgentMessage[];
  isActive: boolean;
  askQuestion: (question: string) => Promise<void>;
  explainError: (errorId: string) => void;
  explainViolation: (violationId: string) => void;
  clearMessages: () => void;
}

export function useArchitectAgent(options: UseArchitectAgentOptions): UseArchitectAgentReturn {
  const { enabled = true, validationErrors, safetyViolations } = options;
  
  const [messages, setMessages] = useState<ArchitectAgentMessage[]>([]);
  
  // Add message helper
  const addMessage = useCallback((message: Omit<ArchitectAgentMessage, 'id' | 'timestamp'>) => {
    const newMessage: ArchitectAgentMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);
  
  // Ask question
  const askQuestion = useCallback(async (question: string) => {
    if (!enabled) return;
    
    // Agent answers questions about architecture
    // MAY: answer questions
    // MAY NOT: suggest designs, choose aesthetics
    
    addMessage({
      type: 'answer',
      content: `Regarding "${question}": I can explain architectural rules and why certain patterns are required or forbidden. I cannot suggest specific designs or aesthetic choices.`,
      source_citation: 'XR Architecture System - Agent Capabilities',
    });
  }, [enabled, addMessage]);
  
  // Explain error
  const explainError = useCallback((errorId: string) => {
    if (!enabled) return;
    
    const error = validationErrors.find(e => e.id === errorId);
    if (!error) return;
    
    addMessage({
      type: 'explanation',
      content: `This error occurs because: ${error.why_blocked}. To fix it: ${error.how_to_fix}`,
      rule_reference: error.rule_violated,
      source_citation: `Validation Rule: ${error.rule_violated}`,
    });
  }, [enabled, validationErrors, addMessage]);
  
  // Explain violation
  const explainViolation = useCallback((violationId: string) => {
    if (!enabled) return;
    
    const violation = safetyViolations.find(v => v.id === violationId);
    if (!violation) return;
    
    addMessage({
      type: 'warning',
      content: `Safety violation: ${violation.why_dangerous}. Resolution: ${violation.resolution}`,
      rule_reference: violation.guarantee_violated,
      source_citation: `Safety Guarantee: ${violation.guarantee_violated}`,
    });
  }, [enabled, safetyViolations, addMessage]);
  
  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    isActive: enabled,
    askQuestion,
    explainError,
    explainViolation,
    clearMessages,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSIONING HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseVersioningOptions {
  space: XRSpace | null;
  onVersionChange?: (version: SpaceVersion) => void;
}

export interface UseVersioningReturn {
  currentVersion: string;
  versions: SpaceVersion[];
  createVersion: (changes: SemanticChange[]) => SpaceVersion;
  rollback: (versionId: string) => void;
  getSemanticDiff: (fromVersion: string, toVersion: string) => SemanticChange[];
}

export function useVersioning(options: UseVersioningOptions): UseVersioningReturn {
  const { space, onVersionChange } = options;
  
  const currentVersion = space?.versioning.current_version ?? '0.0.0';
  const versions = space?.versioning.version_timeline ?? [];
  
  const createVersion = useCallback((changes: SemanticChange[]): SpaceVersion => {
    const newVersion: SpaceVersion = {
      id: `v-${Date.now()}`,
      version: currentVersion,
      created_at: new Date().toISOString(),
      created_by: space?.created_by ?? 'unknown',
      changes,
      is_locked: false,
    };
    
    onVersionChange?.(newVersion);
    return newVersion;
  }, [currentVersion, space?.created_by, onVersionChange]);
  
  const rollback = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;
    
    // Rollback logic would go here
    logger.debug('Rolling back to version:', versionId);
  }, [versions]);
  
  const getSemanticDiff = useCallback((
    fromVersion: string,
    toVersion: string
  ): SemanticChange[] => {
    // Would compute semantic diff between versions
    return [];
  }, []);
  
  return {
    currentVersion,
    versions,
    createVersion,
    rollback,
    getSemanticDiff,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseXRSpaceBuilderOptions {
  user_id: string;
  space_id?: string;
  initial_mode?: CreationMode;
  architect_agent_enabled?: boolean;
  onSpaceCreated?: (space: XRSpace) => void;
  onSpaceUpdated?: (space: XRSpace) => void;
  onStepChange?: (step: CreationStep) => void;
  onValidationChange?: (result: ValidateSpaceResponse) => void;
}

export interface UseXRSpaceBuilderReturn {
  // Flow
  flow: UseCreationFlowReturn;
  
  // Space
  space: UseSpaceReturn;
  
  // Validation
  validation: UseValidationReturn;
  
  // Palette
  palette: UsePrimitivePaletteReturn;
  
  // Preview
  preview: UsePreviewReturn;
  
  // Agent
  agent: UseArchitectAgentReturn;
  
  // Versioning
  versioning: UseVersioningReturn;
  
  // Convenience
  canPublish: boolean;
  publish: () => Promise<void>;
}

export function useXRSpaceBuilder(options: UseXRSpaceBuilderOptions): UseXRSpaceBuilderReturn {
  const {
    user_id,
    space_id,
    initial_mode,
    architect_agent_enabled = true,
    onSpaceCreated,
    onSpaceUpdated,
    onStepChange,
    onValidationChange,
  } = options;
  
  // Creation flow
  const flow = useCreationFlow({
    initial_mode,
    onStepChange,
  });
  
  // Space management
  const space = useSpace({
    space_id,
    user_id,
    onSpaceCreated,
    onSpaceUpdated,
  });
  
  // Validation
  const validation = useValidation({
    space: space.space,
    continuous: true,
    onValidationChange,
  });
  
  // Palette
  const palette = usePrimitivePalette({
    space: space.space,
  });
  
  // Preview
  const preview = usePreview({
    space: space.space,
    onPreviewComplete: () => flow.completeStep('preview'),
  });
  
  // Agent
  const agent = useArchitectAgent({
    enabled: architect_agent_enabled,
    space: space.space,
    validationErrors: validation.errors,
    safetyViolations: validation.safetyViolations,
  });
  
  // Versioning
  const versioning = useVersioning({
    space: space.space,
  });
  
  // Can publish
  const canPublish = useMemo(() => {
    return (
      validation.isValid &&
      validation.isSafe &&
      flow.state.preview_completed &&
      flow.state.completed_steps.includes('validate')
    );
  }, [validation.isValid, validation.isSafe, flow.state]);
  
  // Publish
  const publish = useCallback(async () => {
    if (!canPublish || !space.space) return;
    
    // Create version snapshot
    versioning.createVersion([{
      type: 'added',
      element_type: 'purpose',
      description: 'Published space',
    }]);
    
    // Save
    await space.saveSpace();
    
    logger.debug('Space published:', space.space.id);
  }, [canPublish, space, versioning]);
  
  return {
    flow,
    space,
    validation,
    palette,
    preview,
    agent,
    versioning,
    canPublish,
    publish,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEYBOARD HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseBuilderKeyboardOptions {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useBuilderKeyboard(options: UseBuilderKeyboardOptions): void {
  const {
    onSave,
    onUndo,
    onRedo,
    onDelete,
    onEscape,
    enabled = true,
  } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
      
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
      }
      
      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        onRedo?.();
      }
      
      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only if not in input
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          onDelete?.();
        }
      }
      
      // Escape: Exit mode
      if (e.key === 'Escape') {
        onEscape?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onSave, onUndo, onRedo, onDelete, onEscape]);
}

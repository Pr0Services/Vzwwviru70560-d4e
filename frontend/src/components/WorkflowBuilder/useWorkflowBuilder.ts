/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — USE WORKFLOW BUILDER HOOK
   State management for workflow builder
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowExecution,
  ExecutionLog,
  ValidationError,
  Position 
} from './types';

// ════════════════════════════════════════════════════════════════════════════════
// STORAGE KEY
// ════════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'chenu-workflows';

// ════════════════════════════════════════════════════════════════════════════════
// GENERATE ID
// ════════════════════════════════════════════════════════════════════════════════

const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ════════════════════════════════════════════════════════════════════════════════
// HOOK RETURN TYPE
// ════════════════════════════════════════════════════════════════════════════════

interface UseWorkflowBuilderReturn {
  // Workflows
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  
  // Actions
  createWorkflow: (name: string) => Workflow;
  loadWorkflow: (id: string) => void;
  saveWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string) => Workflow;
  
  // Node operations
  addNode: (node: Omit<WorkflowNode, 'id'>) => string;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, position: Position) => void;
  
  // Edge operations
  addEdge: (source: string, target: string, sourceHandle?: string) => string | null;
  deleteEdge: (edgeId: string) => void;
  
  // Validation
  validate: () => ValidationError[];
  validationErrors: ValidationError[];
  isValid: boolean;
  
  // Execution
  execute: () => Promise<WorkflowExecution>;
  currentExecution: WorkflowExecution | null;
  executionHistory: WorkflowExecution[];
  isExecuting: boolean;
  
  // History (undo/redo)
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  
  // Export/Import
  exportWorkflow: (workflow: Workflow) => string;
  importWorkflow: (json: string) => Workflow | null;
}

// ════════════════════════════════════════════════════════════════════════════════
// HOOK
// ════════════════════════════════════════════════════════════════════════════════

export const useWorkflowBuilder = (): UseWorkflowBuilderReturn => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);
  const [executionHistory, setExecutionHistory] = useState<WorkflowExecution[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<{ past: Workflow[]; future: Workflow[] }>({
    past: [],
    future: [],
  });

  // Current workflow
  const currentWorkflow = useMemo(() => {
    return workflows.find(w => w.id === currentWorkflowId) || null;
  }, [workflows, currentWorkflowId]);

  // Load workflows from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const loaded = parsed.map((w: unknown) => ({
          ...w,
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt),
          lastExecutedAt: w.lastExecutedAt ? new Date(w.lastExecutedAt) : undefined,
        }));
        setWorkflows(loaded);
      }
    } catch (error) {
      logger.error('Failed to load workflows:', error);
    }
  }, []);

  // Save workflows to storage
  const persistWorkflows = useCallback((wfs: Workflow[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wfs));
    } catch (error) {
      logger.error('Failed to save workflows:', error);
    }
  }, []);

  // Push to history (for undo)
  const pushHistory = useCallback((workflow: Workflow) => {
    setHistory(prev => ({
      past: [...prev.past.slice(-20), workflow], // Keep last 20 states
      future: [],
    }));
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // WORKFLOW OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const createWorkflow = useCallback((name: string): Workflow => {
    const newWorkflow: Workflow = {
      id: generateId('wf'),
      name,
      version: 1,
      status: 'draft',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user',
      executionCount: 0,
    };

    setWorkflows(prev => {
      const updated = [...prev, newWorkflow];
      persistWorkflows(updated);
      return updated;
    });
    
    setCurrentWorkflowId(newWorkflow.id);
    return newWorkflow;
  }, [persistWorkflows]);

  const loadWorkflow = useCallback((id: string) => {
    setCurrentWorkflowId(id);
    setHistory({ past: [], future: [] });
  }, []);

  const saveWorkflow = useCallback((workflow: Workflow) => {
    const updated = { ...workflow, updatedAt: new Date() };
    
    setWorkflows(prev => {
      const index = prev.findIndex(w => w.id === workflow.id);
      let newWorkflows: Workflow[];
      
      if (index >= 0) {
        newWorkflows = [...prev];
        newWorkflows[index] = updated;
      } else {
        newWorkflows = [...prev, updated];
      }
      
      persistWorkflows(newWorkflows);
      return newWorkflows;
    });
  }, [persistWorkflows]);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows(prev => {
      const updated = prev.filter(w => w.id !== id);
      persistWorkflows(updated);
      return updated;
    });
    
    if (currentWorkflowId === id) {
      setCurrentWorkflowId(null);
    }
  }, [currentWorkflowId, persistWorkflows]);

  const duplicateWorkflow = useCallback((id: string): Workflow => {
    const original = workflows.find(w => w.id === id);
    if (!original) throw new Error('Workflow not found');

    const duplicate: Workflow = {
      ...original,
      id: generateId('wf'),
      name: `${original.name} (copy)`,
      nameFr: original.nameFr ? `${original.nameFr} (copie)` : undefined,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      lastExecutedAt: undefined,
    };

    setWorkflows(prev => {
      const updated = [...prev, duplicate];
      persistWorkflows(updated);
      return updated;
    });

    return duplicate;
  }, [workflows, persistWorkflows]);

  // ════════════════════════════════════════════════════════════════════════════
  // NODE OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const addNode = useCallback((node: Omit<WorkflowNode, 'id'>): string => {
    if (!currentWorkflow) throw new Error('No workflow selected');
    
    const nodeId = generateId('node');
    const newNode = { ...node, id: nodeId } as WorkflowNode;
    
    pushHistory(currentWorkflow);
    
    setWorkflows(prev => prev.map(w => 
      w.id === currentWorkflowId 
        ? { ...w, nodes: [...w.nodes, newNode], updatedAt: new Date() }
        : w
    ));
    
    return nodeId;
  }, [currentWorkflow, currentWorkflowId, pushHistory]);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    if (!currentWorkflow) return;
    
    pushHistory(currentWorkflow);
    
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId
        ? {
            ...w,
            nodes: w.nodes.map(n => n.id === nodeId ? { ...n, ...updates } as WorkflowNode : n),
            updatedAt: new Date(),
          }
        : w
    ));
  }, [currentWorkflow, currentWorkflowId, pushHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    if (!currentWorkflow) return;
    
    pushHistory(currentWorkflow);
    
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId
        ? {
            ...w,
            nodes: w.nodes.filter(n => n.id !== nodeId),
            edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
            updatedAt: new Date(),
          }
        : w
    ));
  }, [currentWorkflow, currentWorkflowId, pushHistory]);

  const moveNode = useCallback((nodeId: string, position: Position) => {
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId
        ? {
            ...w,
            nodes: w.nodes.map(n => n.id === nodeId ? { ...n, position } : n),
          }
        : w
    ));
  }, [currentWorkflowId]);

  // ════════════════════════════════════════════════════════════════════════════
  // EDGE OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const addEdge = useCallback((source: string, target: string, sourceHandle?: string): string | null => {
    if (!currentWorkflow) return null;
    
    // Prevent duplicates and self-connections
    const exists = currentWorkflow.edges.some(
      e => e.source === source && e.target === target
    );
    if (exists || source === target) return null;
    
    const edgeId = generateId('edge');
    const newEdge: WorkflowEdge = {
      id: edgeId,
      source,
      target,
      sourceHandle,
      animated: true,
    };
    
    pushHistory(currentWorkflow);
    
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId
        ? { ...w, edges: [...w.edges, newEdge], updatedAt: new Date() }
        : w
    ));
    
    return edgeId;
  }, [currentWorkflow, currentWorkflowId, pushHistory]);

  const deleteEdge = useCallback((edgeId: string) => {
    if (!currentWorkflow) return;
    
    pushHistory(currentWorkflow);
    
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId
        ? { ...w, edges: w.edges.filter(e => e.id !== edgeId), updatedAt: new Date() }
        : w
    ));
  }, [currentWorkflow, currentWorkflowId, pushHistory]);

  // ════════════════════════════════════════════════════════════════════════════
  // VALIDATION
  // ════════════════════════════════════════════════════════════════════════════

  const validate = useCallback((): ValidationError[] => {
    if (!currentWorkflow) return [];
    
    const errors: ValidationError[] = [];
    const { nodes, edges } = currentWorkflow;
    
    // Check for trigger
    const triggers = nodes.filter(n => n.type === 'trigger');
    if (triggers.length === 0) {
      errors.push({
        message: 'Workflow must have at least one trigger',
        messageFr: 'Le workflow doit avoir au moins un déclencheur',
        severity: 'error',
      });
    }
    
    // Check for end node
    const ends = nodes.filter(n => n.type === 'end');
    if (ends.length === 0) {
      errors.push({
        message: 'Workflow should have at least one end node',
        messageFr: 'Le workflow devrait avoir au moins un nœud de fin',
        severity: 'warning',
      });
    }
    
    // Check for disconnected nodes
    nodes.forEach(node => {
      if (node.type === 'trigger') return; // Triggers don't need inputs
      
      const hasInput = edges.some(e => e.target === node.id);
      if (!hasInput) {
        errors.push({
          nodeId: node.id,
          message: `Node "${node.label}" has no input connection`,
          messageFr: `Le nœud "${node.labelFr || node.label}" n'a pas de connexion entrante`,
          severity: 'warning',
        });
      }
    });
    
    // Check for nodes without outputs (except end nodes)
    nodes.forEach(node => {
      if (node.type === 'end') return;
      
      const hasOutput = edges.some(e => e.source === node.id);
      if (!hasOutput) {
        errors.push({
          nodeId: node.id,
          message: `Node "${node.label}" has no output connection`,
          messageFr: `Le nœud "${node.labelFr || node.label}" n'a pas de connexion sortante`,
          severity: 'warning',
        });
      }
    });
    
    // Check condition nodes have both branches
    nodes.filter(n => n.type === 'condition').forEach(node => {
      const trueEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'true');
      const falseEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'false');
      
      if (!trueEdge || !falseEdge) {
        errors.push({
          nodeId: node.id,
          message: 'Condition node must have both true and false branches',
          messageFr: 'Le nœud condition doit avoir les deux branches (vrai et faux)',
          severity: 'error',
        });
      }
    });
    
    setValidationErrors(errors);
    return errors;
  }, [currentWorkflow]);

  const isValid = useMemo(() => {
    return validationErrors.filter(e => e.severity === 'error').length === 0;
  }, [validationErrors]);

  // ════════════════════════════════════════════════════════════════════════════
  // EXECUTION (Mock)
  // ════════════════════════════════════════════════════════════════════════════

  const execute = useCallback(async (): Promise<WorkflowExecution> => {
    if (!currentWorkflow) throw new Error('No workflow selected');
    
    const errors = validate();
    if (errors.some(e => e.severity === 'error')) {
      throw new Error('Workflow has validation errors');
    }
    
    setIsExecuting(true);
    
    const execution: WorkflowExecution = {
      id: generateId('exec'),
      workflowId: currentWorkflow.id,
      workflowVersion: currentWorkflow.version,
      status: 'running',
      completedNodes: [],
      triggerData: {},
      context: {},
      outputs: {},
      startedAt: new Date(),
      logs: [],
      tokensUsed: 0,
    };
    
    setCurrentExecution(execution);
    
    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const completedExecution: WorkflowExecution = {
      ...execution,
      status: 'completed',
      completedAt: new Date(),
      completedNodes: currentWorkflow.nodes.map(n => n.id),
      logs: [
        { timestamp: new Date(), nodeId: '', nodeName: 'System', level: 'info', message: 'Workflow completed successfully' },
      ],
      tokensUsed: Math.floor(Math.random() * 500) + 100,
    };
    
    setCurrentExecution(completedExecution);
    setExecutionHistory(prev => [completedExecution, ...prev].slice(0, 50));
    setIsExecuting(false);
    
    // Update workflow stats
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId
        ? {
            ...w,
            executionCount: w.executionCount + 1,
            lastExecutedAt: new Date(),
          }
        : w
    ));
    
    return completedExecution;
  }, [currentWorkflow, currentWorkflowId, validate]);

  // ════════════════════════════════════════════════════════════════════════════
  // UNDO/REDO
  // ════════════════════════════════════════════════════════════════════════════

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo || !currentWorkflow) return;
    
    const previous = history.past[history.past.length - 1];
    
    setHistory(prev => ({
      past: prev.past.slice(0, -1),
      future: [currentWorkflow, ...prev.future],
    }));
    
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId ? previous : w
    ));
  }, [canUndo, currentWorkflow, currentWorkflowId, history.past]);

  const redo = useCallback(() => {
    if (!canRedo || !currentWorkflow) return;
    
    const next = history.future[0];
    
    setHistory(prev => ({
      past: [...prev.past, currentWorkflow],
      future: prev.future.slice(1),
    }));
    
    setWorkflows(prev => prev.map(w =>
      w.id === currentWorkflowId ? next : w
    ));
  }, [canRedo, currentWorkflow, currentWorkflowId, history.future]);

  // ════════════════════════════════════════════════════════════════════════════
  // EXPORT/IMPORT
  // ════════════════════════════════════════════════════════════════════════════

  const exportWorkflow = useCallback((workflow: Workflow): string => {
    return JSON.stringify(workflow, null, 2);
  }, []);

  const importWorkflow = useCallback((json: string): Workflow | null => {
    try {
      const parsed = JSON.parse(json);
      const workflow: Workflow = {
        ...parsed,
        id: generateId('wf'), // Generate new ID
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        executionCount: 0,
      };
      
      setWorkflows(prev => {
        const updated = [...prev, workflow];
        persistWorkflows(updated);
        return updated;
      });
      
      return workflow;
    } catch (error) {
      logger.error('Failed to import workflow:', error);
      return null;
    }
  }, [persistWorkflows]);

  return {
    workflows,
    currentWorkflow,
    createWorkflow,
    loadWorkflow,
    saveWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    addNode,
    updateNode,
    deleteNode,
    moveNode,
    addEdge,
    deleteEdge,
    validate,
    validationErrors,
    isValid,
    execute,
    currentExecution,
    executionHistory,
    isExecuting,
    canUndo,
    canRedo,
    undo,
    redo,
    exportWorkflow,
    importWorkflow,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default useWorkflowBuilder;

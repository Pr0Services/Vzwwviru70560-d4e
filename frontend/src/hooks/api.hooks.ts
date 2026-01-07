/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — API DOMAIN HOOKS                            ║
 * ║                    Hooks React connectés au Mock API                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Ces hooks connectent directement aux stores et au mock API.
 * Quand le backend sera prêt, on changera juste l'import de l'API.
 */

import { useState, useCallback, useEffect } from 'react';
import { api, ApiResponse } from '../mocks';
import { useUIStore } from '../stores/ui.store';
import { logger } from '../utils/logger';

// ═══════════════════════════════════════════════════════════════════════════════
// GENERIC HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  deps: unknown[] = []
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  
  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetcher();
      if (result.success && result.data !== undefined) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error || 'Erreur' });
      }
    } catch (err) {
      setState({ data: null, loading: false, error: 'Erreur réseau' });
    }
  }, [fetcher]);
  
  useEffect(() => {
    fetch();
  }, deps);
  
  return { ...state, refetch: fetch };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useAuthLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useUIStore();
  
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.auth.login(email, password);
      
      if (result.success && result.data) {
        localStorage.setItem('chenu_token', result.data.token);
        addToast({ type: 'success', title: 'Bienvenue!', message: `Connecté en tant que ${result.data.user.name}` });
        setLoading(false);
        return result.data;
      } else {
        setError(result.error || 'Erreur de connexion');
        addToast({ type: 'error', title: 'Erreur', message: result.error || 'Connexion échouée' });
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('Erreur réseau');
      setLoading(false);
      return null;
    }
  }, [addToast]);
  
  return { login, loading, error };
}

export function useAuthLogout() {
  const { addToast } = useUIStore();
  
  const logout = useCallback(async () => {
    await api.auth.logout();
    localStorage.removeItem('chenu_token');
    addToast({ type: 'info', title: 'Déconnexion', message: 'À bientôt!' });
  }, [addToast]);
  
  return { logout };
}

export function useAuthMe() {
  return useFetch(() => api.auth.getMe(), []);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useAgentsList(sphereId?: string) {
  return useFetch(() => api.agents.getAll(sphereId), [sphereId]);
}

export function useAgentDetail(id: string) {
  return useFetch(() => api.agents.getById(id), [id]);
}

export function useAgentStatusUpdate() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const updateStatus = useCallback(async (id: string, status: string) => {
    setLoading(true);
    const result = await api.agents.updateStatus(id, status);
    setLoading(false);
    
    if (result.success) {
      addToast({ type: 'success', title: 'Agent mis à jour', message: `Status: ${status}` });
      return result.data;
    }
    return null;
  }, [addToast]);
  
  return { updateStatus, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREADS HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useThreadsList(sphereId?: string) {
  return useFetch(() => api.threads.getAll(sphereId), [sphereId]);
}

export function useThreadDetail(id: string) {
  return useFetch(() => api.threads.getById(id), [id]);
}

export function useThreadCreate() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const create = useCallback(async (data: { title: string; sphereId: string }) => {
    setLoading(true);
    const result = await api.threads.create(data);
    setLoading(false);
    
    if (result.success && result.data) {
      addToast({ type: 'success', title: 'Thread créé', message: data.title });
      return result.data;
    }
    return null;
  }, [addToast]);
  
  return { create, loading };
}

export function useThreadAddMessage() {
  const [loading, setLoading] = useState(false);
  
  const addMessage = useCallback(async (threadId: string, content: string) => {
    setLoading(true);
    const result = await api.threads.addMessage(threadId, content);
    setLoading(false);
    
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  }, []);
  
  return { addMessage, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATASPACES HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useDataspacesList(sphereId?: string) {
  return useFetch(() => api.dataspaces.getAll(sphereId), [sphereId]);
}

export function useDataspaceDetail(id: string) {
  return useFetch(() => api.dataspaces.getById(id), [id]);
}

export function useDataspaceCreate() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const create = useCallback(async (data: { name: string; description?: string; sphereId: string }) => {
    setLoading(true);
    const result = await api.dataspaces.create(data);
    setLoading(false);
    
    if (result.success && result.data) {
      addToast({ type: 'success', title: 'Dataspace créé', message: data.name });
      return result.data;
    }
    return null;
  }, [addToast]);
  
  return { create, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEETINGS HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useMeetingsList(sphereId?: string) {
  return useFetch(() => api.meetings.getAll(sphereId), [sphereId]);
}

export function useMeetingCreate() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const create = useCallback(async (data: { title: string; sphereId: string; startTime: string; endTime: string }) => {
    setLoading(true);
    const result = await api.meetings.create(data);
    setLoading(false);
    
    if (result.success && result.data) {
      addToast({ type: 'success', title: 'Réunion planifiée', message: data.title });
      return result.data;
    }
    return null;
  }, [addToast]);
  
  return { create, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA PIPELINE HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaQueryResult {
  requestId: string;
  encoding: {
    id: string;
    intent: string;
    actions: { id: string; type: string; description: string }[];
    sensitivity: 'low' | 'medium' | 'high' | 'critical';
    requiresApproval: boolean;
  };
}

export interface NovaExecutionResult {
  status: 'success' | 'failed';
  output: string;
  tokensUsed: number;
}

export function useNovaPipeline() {
  const [loading, setLoading] = useState(false);
  const [encoding, setEncoding] = useState<NovaQueryResult['encoding'] | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [result, setResult] = useState<NovaExecutionResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'encoding' | 'checkpoint' | 'executing' | 'completed' | 'cancelled' | 'failed'>('idle');
  const { addToast } = useUIStore();
  
  const query = useCallback(async (input: string, sphereId: string) => {
    setLoading(true);
    setStatus('encoding');
    setResult(null);
    
    logger.nova('Starting query', { input, sphereId });
    
    const queryResult = await api.nova.query(input, sphereId);
    
    if (queryResult.success && queryResult.data) {
      setEncoding(queryResult.data.encoding);
      setRequestId(queryResult.data.requestId);
      setStatus('checkpoint');
      setLoading(false);
      return queryResult.data;
    } else {
      setStatus('failed');
      setLoading(false);
      addToast({ type: 'error', title: 'Erreur Nova', message: queryResult.error || 'Erreur' });
      return null;
    }
  }, [addToast]);
  
  const approve = useCallback(async () => {
    if (!requestId) return null;
    
    setLoading(true);
    setStatus('executing');
    
    logger.nova('Approving checkpoint', { requestId });
    
    const approveResult = await api.nova.approve(requestId);
    
    if (approveResult.success && approveResult.data) {
      const execResult = await api.nova.execute(approveResult.data.executionId);
      
      if (execResult.success && execResult.data) {
        setResult(execResult.data);
        setStatus('completed');
        setLoading(false);
        addToast({ type: 'success', title: 'Exécution terminée', message: 'Pipeline complété avec succès' });
        return execResult.data;
      }
    }
    
    setStatus('failed');
    setLoading(false);
    addToast({ type: 'error', title: 'Erreur', message: 'Exécution échouée' });
    return null;
  }, [requestId, addToast]);
  
  const reject = useCallback(async (reason?: string) => {
    if (!requestId) return;
    
    logger.nova('Rejecting checkpoint', { requestId, reason });
    
    await api.nova.reject(requestId, reason);
    
    setStatus('cancelled');
    setEncoding(null);
    setRequestId(null);
    addToast({ type: 'warning', title: 'Annulé', message: 'Exécution annulée par l\'utilisateur' });
  }, [requestId, addToast]);
  
  const reset = useCallback(() => {
    setEncoding(null);
    setRequestId(null);
    setResult(null);
    setStatus('idle');
    setLoading(false);
  }, []);
  
  return {
    query,
    approve,
    reject,
    reset,
    loading,
    encoding,
    requestId,
    result,
    status,
    isCheckpoint: status === 'checkpoint',
    isComplete: status === 'completed',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useCheckpointsList() {
  return useFetch(() => api.governance.getCheckpoints(), []);
}

export function useCheckpointResolve() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const resolve = useCallback(async (id: string, decision: 'approve' | 'reject') => {
    setLoading(true);
    const result = await api.governance.resolveCheckpoint(id, decision);
    setLoading(false);
    
    if (result.success) {
      addToast({ 
        type: decision === 'approve' ? 'success' : 'warning', 
        title: decision === 'approve' ? 'Approuvé' : 'Rejeté',
        message: `Checkpoint ${id} ${decision === 'approve' ? 'approuvé' : 'rejeté'}` 
      });
      return true;
    }
    return false;
  }, [addToast]);
  
  return { resolve, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOKENS HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useTokenBudget() {
  return useFetch(() => api.tokens.getBudget(), []);
}

export function useTokenReserve() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const reserve = useCallback(async (amount: number, agentId: string) => {
    setLoading(true);
    const result = await api.tokens.reserveTokens(amount, agentId);
    setLoading(false);
    
    if (result.success && result.data) {
      return result.data.reservationId;
    } else {
      addToast({ type: 'error', title: 'Erreur', message: result.error || 'Réservation échouée' });
      return null;
    }
  }, [addToast]);
  
  return { reserve, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPTURES HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useCapturesList(sphereId?: string) {
  return useFetch(() => api.captures.getAll(sphereId), [sphereId]);
}

export function useCaptureCreate() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();
  
  const create = useCallback(async (content: string, sphereId: string) => {
    setLoading(true);
    const result = await api.captures.create({ content, sphereId });
    setLoading(false);
    
    if (result.success && result.data) {
      addToast({ type: 'success', title: '✓ Capturé!', message: 'Note enregistrée' });
      return result.data;
    }
    return null;
  }, [addToast]);
  
  return { create, loading };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const apiHooks = {
  // Auth
  useAuthLogin,
  useAuthLogout,
  useAuthMe,
  
  // Agents
  useAgentsList,
  useAgentDetail,
  useAgentStatusUpdate,
  
  // Threads
  useThreadsList,
  useThreadDetail,
  useThreadCreate,
  useThreadAddMessage,
  
  // Dataspaces
  useDataspacesList,
  useDataspaceDetail,
  useDataspaceCreate,
  
  // Meetings
  useMeetingsList,
  useMeetingCreate,
  
  // Nova
  useNovaPipeline,
  
  // Governance
  useCheckpointsList,
  useCheckpointResolve,
  
  // Tokens
  useTokenBudget,
  useTokenReserve,
  
  // Captures
  useCapturesList,
  useCaptureCreate,
};

export default apiHooks;

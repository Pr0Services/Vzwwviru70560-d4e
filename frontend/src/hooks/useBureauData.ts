/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — USE BUREAU DATA HOOK                            ║
 * ║                    Bridge central: Sections ↔ Stores                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce hook centralise l'accès aux données du Bureau depuis les stores Zustand.
 * 
 * UTILISATION:
 * ```tsx
 * const { threads, tasks, meetings, agents, isLoading } = useBureauData(sphereId);
 * ```
 * 
 * PRINCIPE:
 * - Une seule source de vérité (stores Zustand)
 * - Filtrage automatique par sphère
 * - Actions CRUD centralisées
 */

import { useMemo, useCallback } from 'react';
import { useThreadStore, Thread, ThreadStatus } from '../stores/thread.store';
import { useMeetingStore, Meeting, MeetingStatus } from '../stores/meetingStore';
import { useAgentStore } from '../stores/agent.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface BureauDataStats {
  totalThreads: number;
  activeThreads: number;
  totalMeetings: number;
  upcomingMeetings: number;
  totalAgents: number;
  activeAgents: number;
  tokensUsed: number;
  tokensBudget: number;
}

export interface UseBureauDataReturn {
  // Données filtrées par sphère
  threads: Thread[];
  meetings: Meeting[];
  agents: unknown[]; // Type from agentStore
  
  // Stats
  stats: BureauDataStats;
  
  // États
  isLoading: boolean;
  error: string | null;
  
  // Actions Threads
  createThread: (data: CreateThreadInput) => Thread;
  updateThread: (id: string, data: Partial<Thread>) => void;
  deleteThread: (id: string) => void;
  
  // Actions Meetings
  createMeeting: (data: CreateMeetingInput) => Meeting;
  updateMeeting: (id: string, data: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  
  // Actions Agents
  hireAgent: (data: unknown) => void;
  fireAgent: (id: string) => void;
  
  // Refresh
  refreshAll: () => void;
}

interface CreateThreadInput {
  title: string;
  description?: string;
  tokenBudget?: number;
  tags?: string[];
}

interface CreateMeetingInput {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: unknown[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export function useBureauData(sphereId: string): UseBureauDataReturn {
  // ─────────────────────────────────────────────────────────────────────────────
  // CONNEXION AUX STORES
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Thread Store
  const threadStore = useThreadStore();
  const {
    threads: allThreads,
    createThread: storeCreateThread,
    updateThread: storeUpdateThread,
    deleteThread: storeDeleteThread,
    getThreadsBySphere,
  } = threadStore;

  // Meeting Store
  const meetingStore = useMeetingStore();
  const {
    meetings: allMeetings,
    createMeeting: storeCreateMeeting,
    updateMeeting: storeUpdateMeeting,
    deleteMeeting: storeDeleteMeeting,
  } = meetingStore;

  // Agent Store
  const agentStore = useAgentStore();
  const {
    agents: allAgents,
  } = agentStore;

  // ─────────────────────────────────────────────────────────────────────────────
  // DONNÉES FILTRÉES PAR SPHÈRE
  // ─────────────────────────────────────────────────────────────────────────────
  
  const threads = useMemo(() => {
    // @ts-ignore - compatibility avec SphereId
    return getThreadsBySphere(sphereId as any);
  }, [getThreadsBySphere, sphereId, allThreads]);

  const meetings = useMemo(() => {
    if (!allMeetings) return [];
    return Object.values(allMeetings).filter(
      (m: Meeting) => m.sphereId === sphereId
    );
  }, [allMeetings, sphereId]);

  const agents = useMemo(() => {
    if (!allAgents) return [];
    // Filtrer les agents assignés à cette sphère
    return Object.values(allAgents).filter(
      (a: unknown) => a.sphereId === sphereId || a.scope === 'global'
    );
  }, [allAgents, sphereId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // STATISTIQUES
  // ─────────────────────────────────────────────────────────────────────────────
  
  const stats = useMemo((): BureauDataStats => {
    const now = new Date();
    
    // Threads stats
    const activeThreads = threads.filter(t => t.status === 'active').length;
    const threadTokensUsed = threads.reduce((sum, t) => sum + t.tokensUsed, 0);
    const threadTokensBudget = threads.reduce((sum, t) => sum + t.tokenBudget, 0);
    
    // Meetings stats
    const upcomingMeetings = meetings.filter(
      (m: Meeting) => new Date(m.startTime) > now && m.status === 'scheduled'
    ).length;
    
    // Agents stats
    const activeAgents = agents.filter((a: unknown) => a.status === 'active').length;
    
    return {
      totalThreads: threads.length,
      activeThreads,
      totalMeetings: meetings.length,
      upcomingMeetings,
      totalAgents: agents.length,
      activeAgents,
      tokensUsed: threadTokensUsed,
      tokensBudget: threadTokensBudget,
    };
  }, [threads, meetings, agents]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS THREADS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const createThread = useCallback((data: CreateThreadInput): Thread => {
    return storeCreateThread({
      title: data.title,
      description: data.description,
      // @ts-ignore
      sphereId: sphereId as any,
      ownerId: 'current_user', // TODO: Get from auth store
      tokenBudget: data.tokenBudget || 5000,
      tags: data.tags || [],
    });
  }, [storeCreateThread, sphereId]);

  const updateThread = useCallback((id: string, data: Partial<Thread>) => {
    storeUpdateThread(id, data);
  }, [storeUpdateThread]);

  const deleteThread = useCallback((id: string) => {
    storeDeleteThread(id);
  }, [storeDeleteThread]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS MEETINGS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const createMeeting = useCallback((data: CreateMeetingInput): Meeting => {
    return storeCreateMeeting({
      title: data.title,
      description: data.description || '',
      // @ts-ignore
      sphereId: sphereId as any,
      startTime: data.startTime,
      endTime: data.endTime,
      organizerId: 'current_user',
      attendees: data.attendees || [],
      isVirtual: true,
    });
  }, [storeCreateMeeting, sphereId]);

  const updateMeeting = useCallback((id: string, data: Partial<Meeting>) => {
    storeUpdateMeeting(id, data);
  }, [storeUpdateMeeting]);

  const deleteMeeting = useCallback((id: string) => {
    storeDeleteMeeting(id);
  }, [storeDeleteMeeting]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS AGENTS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const hireAgent = useCallback((data: unknown) => {
    // TODO: Implement when agent store actions are verified
    // logger.debug('Hiring agent:', data);
  }, []);

  const fireAgent = useCallback((id: string) => {
    // TODO: Implement when agent store actions are verified
    // logger.debug('Firing agent:', id);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // REFRESH
  // ─────────────────────────────────────────────────────────────────────────────
  
  const refreshAll = useCallback(() => {
    // Pour l'instant, les stores sont en mémoire/localStorage
    // En production, cela appellerait les APIs
    // logger.debug('Refreshing bureau data for sphere:', sphereId);
  }, [sphereId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────────
  
  return {
    // Données
    threads,
    meetings,
    agents,
    
    // Stats
    stats,
    
    // États
    isLoading: false, // TODO: Combine loading states from stores
    error: null, // TODO: Combine errors from stores
    
    // Actions Threads
    createThread,
    updateThread,
    deleteThread,
    
    // Actions Meetings
    createMeeting,
    updateMeeting,
    deleteMeeting,
    
    // Actions Agents
    hireAgent,
    fireAgent,
    
    // Refresh
    refreshAll,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS SPÉCIALISÉS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook pour les threads uniquement
 */
export function useBureauThreads(sphereId: string) {
  const { threads, createThread, updateThread, deleteThread, stats } = useBureauData(sphereId);
  return {
    threads,
    createThread,
    updateThread,
    deleteThread,
    totalCount: stats.totalThreads,
    activeCount: stats.activeThreads,
  };
}

/**
 * Hook pour les meetings uniquement
 */
export function useBureauMeetings(sphereId: string) {
  const { meetings, createMeeting, updateMeeting, deleteMeeting, stats } = useBureauData(sphereId);
  return {
    meetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    totalCount: stats.totalMeetings,
    upcomingCount: stats.upcomingMeetings,
  };
}

/**
 * Hook pour les agents uniquement
 */
export function useBureauAgents(sphereId: string) {
  const { agents, hireAgent, fireAgent, stats } = useBureauData(sphereId);
  return {
    agents,
    hireAgent,
    fireAgent,
    totalCount: stats.totalAgents,
    activeCount: stats.activeAgents,
  };
}

/**
 * Hook pour les stats du bureau
 */
export function useBureauStats(sphereId: string) {
  const { stats } = useBureauData(sphereId);
  return stats;
}

export default useBureauData;

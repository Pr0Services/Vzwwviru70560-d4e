/**
 * CHE·NU — XR HOOK
 * ============================================================
 * React hook for XR/Spatial integration.
 * 
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { xrService } from './xr.service';
import type {
  XRSession,
  XRMode,
  XRDeviceType,
  XRSettings,
  XRPanel,
  XRDocument,
  XRPosition,
  XRPerformanceMetrics,
  XRSurfaceNova
} from './xr.types';

// ============================================================
// TYPES
// ============================================================

export interface UseXRReturn {
  // State
  session: XRSession | null;
  isAvailable: boolean;
  isActive: boolean;
  isPaused: boolean;
  
  // Session
  startSession: (mode: XRMode, deviceType: XRDeviceType) => Promise<void>;
  endSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Nova Surface
  showNova: (displayMode?: XRSurfaceNova['displayMode']) => void;
  hideNova: () => void;
  
  // Context Panels
  addPanel: (panel: Omit<XRPanel, 'id'>) => XRPanel | null;
  removePanel: (panelId: string) => void;
  
  // Workspace Documents
  addDocument: (documentId: string, position?: XRPosition) => XRDocument | null;
  removeDocument: (xrDocId: string) => void;
  
  // Settings
  settings: XRSettings | null;
  updateSettings: (settings: Partial<XRSettings>) => void;
  
  // Performance
  metrics: XRPerformanceMetrics | null;
  
  // Quick checks
  isVR: boolean;
  isAR: boolean;
  isMR: boolean;
}

// ============================================================
// HOOK
// ============================================================

export function useXR(): UseXRReturn {
  const [session, setSession] = useState<XRSession | null>(null);
  const [metrics, setMetrics] = useState<XRPerformanceMetrics | null>(null);
  
  // ──────────────────────────────────────────────────────────
  // AVAILABILITY
  // ──────────────────────────────────────────────────────────
  
  const isAvailable = useMemo(() => {
    return xrService.isXRAvailable();
  }, []);
  
  // ──────────────────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ──────────────────────────────────────────────────────────
  
  const startSession = useCallback(async (mode: XRMode, deviceType: XRDeviceType) => {
    try {
      const newSession = await xrService.startSession(mode, deviceType);
      setSession(newSession);
    } catch (error) {
      logger.error('[useXR] Failed to start session:', error);
      throw error;
    }
  }, []);
  
  const endSession = useCallback(async () => {
    await xrService.endSession();
    setSession(null);
    setMetrics(null);
  }, []);
  
  const pauseSession = useCallback(() => {
    xrService.pauseSession();
    setSession(xrService.getSession());
  }, []);
  
  const resumeSession = useCallback(() => {
    xrService.resumeSession();
    setSession(xrService.getSession());
  }, []);
  
  // ──────────────────────────────────────────────────────────
  // NOVA SURFACE
  // ──────────────────────────────────────────────────────────
  
  const showNova = useCallback((displayMode?: XRSurfaceNova['displayMode']) => {
    xrService.showNova(displayMode);
    setSession(xrService.getSession());
  }, []);
  
  const hideNova = useCallback(() => {
    xrService.hideNova();
    setSession(xrService.getSession());
  }, []);
  
  // ──────────────────────────────────────────────────────────
  // PANELS
  // ──────────────────────────────────────────────────────────
  
  const addPanel = useCallback((panel: Omit<XRPanel, 'id'>): XRPanel | null => {
    try {
      const newPanel = xrService.addPanel(panel);
      setSession(xrService.getSession());
      return newPanel;
    } catch {
      return null;
    }
  }, []);
  
  const removePanel = useCallback((panelId: string) => {
    xrService.removePanel(panelId);
    setSession(xrService.getSession());
  }, []);
  
  // ──────────────────────────────────────────────────────────
  // DOCUMENTS
  // ──────────────────────────────────────────────────────────
  
  const addDocument = useCallback((documentId: string, position?: XRPosition): XRDocument | null => {
    try {
      const doc = xrService.addDocument(documentId, position);
      setSession(xrService.getSession());
      return doc;
    } catch {
      return null;
    }
  }, []);
  
  const removeDocument = useCallback((xrDocId: string) => {
    xrService.removeDocument(xrDocId);
    setSession(xrService.getSession());
  }, []);
  
  // ──────────────────────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────────────────────
  
  const updateSettings = useCallback((newSettings: Partial<XRSettings>) => {
    try {
      xrService.updateSettings(newSettings);
      setSession(xrService.getSession());
    } catch (error) {
      logger.error('[useXR] Failed to update settings:', error);
    }
  }, []);
  
  // ──────────────────────────────────────────────────────────
  // PERFORMANCE MONITORING
  // ──────────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!session?.isActive) {
      setMetrics(null);
      return;
    }
    
    const interval = setInterval(() => {
      setMetrics(xrService.getPerformanceMetrics());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [session?.isActive]);
  
  // ──────────────────────────────────────────────────────────
  // COMPUTED
  // ──────────────────────────────────────────────────────────
  
  const isActive = session?.isActive ?? false;
  const isPaused = session?.isPaused ?? false;
  const settings = session?.settings ?? null;
  
  const isVR = session?.mode === 'vr';
  const isAR = session?.mode === 'ar';
  const isMR = session?.mode === 'mr' || session?.mode === 'passthrough';
  
  // ──────────────────────────────────────────────────────────
  // RETURN
  // ──────────────────────────────────────────────────────────
  
  return {
    session,
    isAvailable,
    isActive,
    isPaused,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    showNova,
    hideNova,
    addPanel,
    removePanel,
    addDocument,
    removeDocument,
    settings,
    updateSettings,
    metrics,
    isVR,
    isAR,
    isMR
  };
}

export default useXR;

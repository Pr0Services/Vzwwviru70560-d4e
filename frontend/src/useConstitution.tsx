/* =========================================
   CHEÂ·NU â€” useConstitution Hook
   
   Hook React pour accÃ©der Ã  la constitution
   et valider les actions dans les composants.
   
   Usage:
   const { canWrite, validateAction, paths } = useConstitution();
   ========================================= */

import { useCallback, useMemo } from 'react';
import {
  CONSTITUTION,
  validateAction,
  validateTimelineWrite,
  validateAgentAction,
  validatePresetCount,
  guardTimelineWrite,
  guardAgentAction,
  getPath,
  isOptionAllowed,
  isRestricted,
  generateComplianceReport,
  getViolationLog,
  PathType,
} from './constitution.validator';
import { ConstitutionViolation } from './constitution.types';

// ============================================
// HOOK
// ============================================

export function useConstitution() {
  // === Memoized Constitution ===
  const constitution = useMemo(() => CONSTITUTION, []);
  
  // === Validation Helpers ===
  
  /**
   * Valide si une action est autorisÃ©e
   */
  const checkAction = useCallback((action: string): {
    allowed: boolean;
    violation?: ConstitutionViolation;
  } => {
    const violation = validateAction(action);
    return {
      allowed: violation === null,
      violation: violation ?? undefined,
    };
  }, []);
  
  /**
   * VÃ©rifie si une Ã©criture timeline est autorisÃ©e
   */
  const canWriteTimeline = useCallback((
    humanValidated: boolean,
    source: string
  ): boolean => {
    return validateTimelineWrite(humanValidated, source) === null;
  }, []);
  
  /**
   * VÃ©rifie si une action agent est autorisÃ©e
   */
  const canAgentAct = useCallback((
    agentId: string,
    actionType: 'suggest' | 'decide' | 'apply'
  ): boolean => {
    return validateAgentAction(agentId, actionType) === null;
  }, []);
  
  /**
   * VÃ©rifie le nombre de presets actifs
   */
  const checkPresetCount = useCallback((count: number): boolean => {
    return validatePresetCount(count) === null;
  }, []);
  
  // === Path Helpers ===
  
  /**
   * Obtenir la configuration d'un chemin
   */
  const getPathConfig = useCallback((pathType: PathType) => {
    return getPath(pathType);
  }, []);
  
  /**
   * VÃ©rifier si une option est disponible pour un chemin
   */
  const isPathOptionAllowed = useCallback((
    pathType: PathType,
    option: string
  ): boolean => {
    return isOptionAllowed(pathType, option);
  }, []);
  
  /**
   * VÃ©rifier si une action est restreinte
   */
  const isPathRestricted = useCallback((
    pathType: PathType,
    action: string
  ): boolean => {
    return isRestricted(pathType, action);
  }, []);
  
  // === Guards ===
  
  /**
   * Guard pour Ã©criture timeline sÃ©curisÃ©e
   */
  const safeTimelineWrite = useCallback(<T,>(
    fn: () => T,
    humanValidated: boolean,
    source: string
  ): T | null => {
    return guardTimelineWrite(fn, humanValidated, source);
  }, []);
  
  /**
   * Guard pour action agent sÃ©curisÃ©e
   */
  const safeAgentAction = useCallback(<T,>(
    fn: () => T,
    agentId: string,
    actionType: 'suggest' | 'decide' | 'apply'
  ): T | null => {
    return guardAgentAction(fn, agentId, actionType);
  }, []);
  
  // === Audit ===
  
  /**
   * GÃ©nÃ©rer le rapport de conformitÃ©
   */
  const getComplianceReport = useCallback(() => {
    return generateComplianceReport();
  }, []);
  
  /**
   * Obtenir les violations
   */
  const getViolations = useCallback(() => {
    return getViolationLog();
  }, []);
  
  // === Shortcuts ===
  
  const principles = constitution.principles;
  const paths = constitution.paths;
  const limitations = constitution.limitations;
  const successCriteria = constitution.successCriteria;
  
  return {
    // Constitution complÃ¨te
    constitution,
    
    // Principes
    principles,
    paths,
    limitations,
    successCriteria,
    
    // Validation
    checkAction,
    canWriteTimeline,
    canAgentAct,
    checkPresetCount,
    
    // Paths
    getPathConfig,
    isPathOptionAllowed,
    isPathRestricted,
    
    // Guards
    safeTimelineWrite,
    safeAgentAction,
    
    // Audit
    getComplianceReport,
    getViolations,
    
    // Quick checks
    isHumanInLoop: principles.humanInTheLoop,
    isTimelineImmutable: !constitution.timeline.modifiable,
    maxPresets: limitations.maxSimultaneousPresets,
  };
}

// ============================================
// CONTEXT (Optional - for deep nesting)
// ============================================

import { createContext, useContext, ReactNode } from 'react';

const ConstitutionContext = createContext<ReturnType<typeof useConstitution> | null>(null);

export function ConstitutionProvider({ children }: { children: ReactNode }) {
  const constitution = useConstitution();
  
  return (
    <ConstitutionContext.Provider value={constitution}>
      {children}
    </ConstitutionContext.Provider>
  );
}

export function useConstitutionContext() {
  const context = useContext(ConstitutionContext);
  if (!context) {
    throw new Error('useConstitutionContext must be used within ConstitutionProvider');
  }
  return context;
}

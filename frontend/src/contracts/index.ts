/**
 * CHE·NU V51 — MODULE CONTRACTS INDEX
 * ====================================
 * 
 * Exports all module activation contracts and utilities.
 * 
 * CORE MODULES (5):
 * 1. Reflection Room — cognitive/spatial/integrative
 * 2. Memory Inspector — governance/audit
 * 3. Agent Workspace — assisted reasoning
 * 4. Admin Panel — system governance
 * 5. Incident Room — forensic
 */

// ============================================
// CORE CONTRACT DEFINITION
// ============================================

export * from './ModuleActivationContract';

// ============================================
// MODULE CONTRACTS
// ============================================

export * from './ReflectionRoom.contract';
export * from './MemoryInspector.contract';
export * from './AgentWorkspace.contract';
export * from './AdminPanel.contract';
export * from './IncidentRoom.contract';

// ============================================
// ALL CONTRACTS REGISTRY
// ============================================

import { REFLECTION_ROOM_CONTRACT } from './ReflectionRoom.contract';
import { MEMORY_INSPECTOR_CONTRACT } from './MemoryInspector.contract';
import { AGENT_WORKSPACE_CONTRACT } from './AgentWorkspace.contract';
import { ADMIN_PANEL_CONTRACT } from './AdminPanel.contract';
import { INCIDENT_ROOM_CONTRACT } from './IncidentRoom.contract';
import { ModuleActivationContract } from './ModuleActivationContract';

export const ALL_MODULE_CONTRACTS: Record<string, ModuleActivationContract> = {
  reflection_room: REFLECTION_ROOM_CONTRACT,
  memory_inspector: MEMORY_INSPECTOR_CONTRACT,
  agent_workspace: AGENT_WORKSPACE_CONTRACT,
  admin_panel: ADMIN_PANEL_CONTRACT,
  incident_room: INCIDENT_ROOM_CONTRACT
};

export const CORE_MODULE_IDS = [
  'reflection_room',
  'memory_inspector',
  'agent_workspace',
  'admin_panel',
  'incident_room'
] as const;

export type CoreModuleId = typeof CORE_MODULE_IDS[number];

// ============================================
// CONTRACT RETRIEVAL
// ============================================

export function getModuleContract(module_id: string): ModuleActivationContract | undefined {
  return ALL_MODULE_CONTRACTS[module_id];
}

export function isValidModuleId(module_id: string): module_id is CoreModuleId {
  return CORE_MODULE_IDS.includes(module_id as CoreModuleId);
}

// ============================================
// VALIDATE ALL CONTRACTS
// ============================================

import { validateModuleActivationContract, ContractValidationResult } from './ModuleActivationContract';

export function validateAllContracts(): Record<string, ContractValidationResult> {
  const results: Record<string, ContractValidationResult> = {};
  
  for (const [module_id, contract] of Object.entries(ALL_MODULE_CONTRACTS)) {
    results[module_id] = validateModuleActivationContract(contract);
  }
  
  return results;
}

export function areAllContractsValid(): boolean {
  const results = validateAllContracts();
  return Object.values(results).every(r => r.is_valid);
}

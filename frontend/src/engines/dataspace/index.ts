/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — DATASPACE ENGINE INDEX                                ║
 * ║              Core Infrastructure Engine                                       ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Every entity in CHE·NU exists within a DataSpace."                        ║
 * ║  "A DataSpace is a self-contained micro-environment."                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Classification
  DataSpaceType,
  DataSpaceStatus,
  DataSpaceLevel,
  
  // Hierarchy
  DataSpaceHierarchy,
  
  // Content Types
  DocumentFormat,
  MediaFormat,
  DiagramType,
  DataSpaceDocument,
  DataSpaceMedia,
  DataSpaceTask,
  DataSpaceDiagram,
  DataSpaceXRScene,
  XRObject,
  
  // Metadata & Permissions
  DataSpaceMetadata,
  DataSpacePermissions,
  DataSpaceRole,
  ElevationRequest,
  
  // Temporal
  TemporalLayer,
  DataSpaceChange,
  
  // Agent Memory
  DataSpaceAgentMemory,
  
  // Lifecycle
  LifecyclePhase,
  DataSpaceLifecycle,
  
  // Main Interface
  DataSpace,
  
  // Creation
  CreationMethod,
  DataSpaceCreationRequest,
  
  // Query
  DataSpaceQuery,
  DataSpaceQueryResult,
  
  // Templates
  DataSpaceTemplate,
  
  // Domain-specific configs
  PropertyDataSpaceConfig,
  BuildingDataSpaceConfig,
  ConstructionDataSpaceConfig,
  MeetingDataSpaceConfig,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// BACKSTAGE INTELLIGENCE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  SphereId,
  DomainId,
  ContentType,
  RiskLevel,
  ContextAnalysis,
  IntentAnalysis,
  ExtractedEntity,
  Classification,
  RoutingSuggestion,
  RiskAssessment,
  DetectedRisk,
  RiskType,
  OptimizationHint,
  PreparedContext,
} from './BackstageIntelligenceEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { DataSpaceEngine } from './DataSpaceEngine';
export { BackstageIntelligenceEngine } from './BackstageIntelligenceEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

import { DataSpaceEngine } from './DataSpaceEngine';
import { BackstageIntelligenceEngine } from './BackstageIntelligenceEngine';

export interface DataSpaceEngineSet {
  dataspace: DataSpaceEngine;
  backstage: BackstageIntelligenceEngine;
}

/**
 * Create a DataSpace engine set
 */
export function createDataSpaceEngines(): DataSpaceEngineSet {
  return {
    dataspace: new DataSpaceEngine(),
    backstage: new BackstageIntelligenceEngine(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  DataSpaceEngine,
  BackstageIntelligenceEngine,
  createDataSpaceEngines,
};

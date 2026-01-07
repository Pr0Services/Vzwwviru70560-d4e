/**
 * CHE·NU™ - VERSION STORE
 * 
 * HARD LAWS:
 * - Versions are IMMUTABLE
 * - No overwrite without explicit confirmation
 * - User can compare versions
 * - User can keep their version, agent version, or both
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Version {
  id: string;
  sphereId: SphereId;
  entityType: 'note' | 'document' | 'task' | 'project' | 'data' | 'thread' | 'custom';
  entityId: string;
  
  // Version info
  versionNumber: number;
  label?: string; // Optional human-readable label
  
  // Content
  content: unknown;
  contentType: string;
  contentSize: number;
  checksum: string;
  
  // History
  parentVersionId?: string;
  branchName?: string; // For parallel versions
  
  // Source
  source: 'user' | 'agent' | 'merge' | 'import';
  sourceAgentId?: string;
  sourceStagedItemId?: string;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  description?: string;
  tags: string[];
  
  // Immutability is enforced - this is always true
  readonly isImmutable: true;
}

export interface VersionComparison {
  versionA: Version;
  versionB: Version;
  diff: {
    type: 'text' | 'structured' | 'binary';
    changes: Change[];
    summary: string;
  };
}

export interface Change {
  path: string;
  type: 'add' | 'remove' | 'modify';
  oldValue?: unknown;
  newValue?: unknown;
}

export interface MergeRequest {
  id: string;
  sourceVersionId: string;
  targetVersionId: string;
  status: 'pending' | 'resolved' | 'cancelled';
  conflicts: MergeConflict[];
  resolution?: 'keep_source' | 'keep_target' | 'manual';
  resolvedContent?: unknown;
  createdAt: string;
  resolvedAt?: string;
}

export interface MergeConflict {
  path: string;
  sourceValue: unknown;
  targetValue: unknown;
  resolvedValue?: unknown;
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

interface VersionState {
  // Versions indexed by entity
  versions: Record<string, Version>;
  versionsByEntity: Record<string, string[]>; // entityId -> version IDs (ordered)
  
  // Merge requests
  mergeRequests: Record<string, MergeRequest>;
  
  // Actions
  createVersion: (data: CreateVersionData) => Version;
  getVersionHistory: (entityId: string) => Version[];
  getLatestVersion: (entityId: string) => Version | null;
  getVersion: (versionId: string) => Version | null;
  
  // Comparison
  compareVersions: (versionAId: string, versionBId: string) => VersionComparison | null;
  
  // Merge
  createMergeRequest: (sourceId: string, targetId: string) => MergeRequest;
  resolveConflict: (mergeId: string, conflictPath: string, resolution: unknown) => void;
  completeMerge: (mergeId: string) => Version | null;
  
  // Branching
  createBranch: (fromVersionId: string, branchName: string) => Version;
  
  // Restore
  restoreVersion: (versionId: string, confirm: boolean) => Version | null;
}

interface CreateVersionData {
  sphereId: SphereId;
  entityType: Version['entityType'];
  entityId: string;
  content: unknown;
  contentType: string;
  source: Version['source'];
  sourceAgentId?: string;
  sourceStagedItemId?: string;
  description?: string;
  label?: string;
  tags?: string[];
  branchName?: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateChecksum = (content: unknown): string => {
  const str = JSON.stringify(content);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha_${Math.abs(hash).toString(16).padStart(8, '0')}`;
};

const calculateSize = (content: unknown): number => {
  return new Blob([JSON.stringify(content)]).size;
};

const computeDiff = (a: unknown, b: unknown, path = ''): Change[] => {
  const changes: Change[] = [];
  
  if (typeof a !== typeof b) {
    changes.push({ path: path || 'root', type: 'modify', oldValue: a, newValue: b });
    return changes;
  }
  
  if (typeof a !== 'object' || a === null || b === null) {
    if (a !== b) {
      changes.push({ path: path || 'root', type: 'modify', oldValue: a, newValue: b });
    }
    return changes;
  }
  
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  
  allKeys.forEach((key) => {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in aObj)) {
      changes.push({ path: newPath, type: 'add', newValue: bObj[key] });
    } else if (!(key in bObj)) {
      changes.push({ path: newPath, type: 'remove', oldValue: aObj[key] });
    } else {
      changes.push(...computeDiff(aObj[key], bObj[key], newPath));
    }
  });
  
  return changes;
};

// ═══════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════

export const useVersionStore = create<VersionState>()(
  persist(
    (set, get) => ({
      versions: {},
      versionsByEntity: {},
      mergeRequests: {},

      // ─────────────────────────────────────────────────────────
      // Create Version - IMMUTABLE once created
      // ─────────────────────────────────────────────────────────
      createVersion: (data): Version => {
        const entityVersions = get().versionsByEntity[data.entityId] || [];
        const latestVersion = entityVersions.length > 0 
          ? get().versions[entityVersions[entityVersions.length - 1]]
          : null;
        
        const version: Version = {
          id: generateId(),
          sphereId: data.sphereId,
          entityType: data.entityType,
          entityId: data.entityId,
          versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
          label: data.label,
          content: data.content,
          contentType: data.contentType,
          contentSize: calculateSize(data.content),
          checksum: generateChecksum(data.content),
          parentVersionId: latestVersion?.id,
          branchName: data.branchName,
          source: data.source,
          sourceAgentId: data.sourceAgentId,
          sourceStagedItemId: data.sourceStagedItemId,
          createdAt: new Date().toISOString(),
          createdBy: 'current_user', // Would be from auth
          description: data.description,
          tags: data.tags || [],
          isImmutable: true, // ALWAYS TRUE
        };

        set((state) => ({
          versions: { ...state.versions, [version.id]: version },
          versionsByEntity: {
            ...state.versionsByEntity,
            [data.entityId]: [...(state.versionsByEntity[data.entityId] || []), version.id],
          },
        }));

        return version;
      },

      // ─────────────────────────────────────────────────────────
      // Query
      // ─────────────────────────────────────────────────────────
      getVersionHistory: (entityId) => {
        const versionIds = get().versionsByEntity[entityId] || [];
        return versionIds.map((id) => get().versions[id]).filter(Boolean);
      },

      getLatestVersion: (entityId) => {
        const history = get().getVersionHistory(entityId);
        return history[history.length - 1] || null;
      },

      getVersion: (versionId) => {
        return get().versions[versionId] || null;
      },

      // ─────────────────────────────────────────────────────────
      // Compare - User can compare versions
      // ─────────────────────────────────────────────────────────
      compareVersions: (versionAId, versionBId) => {
        const versionA = get().versions[versionAId];
        const versionB = get().versions[versionBId];
        
        if (!versionA || !versionB) return null;
        
        const changes = computeDiff(versionA.content, versionB.content);
        const additions = changes.filter((c) => c.type === 'add').length;
        const removals = changes.filter((c) => c.type === 'remove').length;
        const modifications = changes.filter((c) => c.type === 'modify').length;
        
        return {
          versionA,
          versionB,
          diff: {
            type: 'structured',
            changes,
            summary: `${additions} additions, ${removals} removals, ${modifications} modifications`,
          },
        };
      },

      // ─────────────────────────────────────────────────────────
      // Merge - User can keep their version, agent version, or both
      // ─────────────────────────────────────────────────────────
      createMergeRequest: (sourceId, targetId) => {
        const source = get().versions[sourceId];
        const target = get().versions[targetId];
        
        if (!source || !target) {
          throw new Error('Source or target version not found');
        }
        
        const changes = computeDiff(target.content, source.content);
        const conflicts: MergeConflict[] = changes
          .filter((c) => c.type === 'modify')
          .map((c) => ({
            path: c.path,
            sourceValue: c.newValue,
            targetValue: c.oldValue,
          }));
        
        const request: MergeRequest = {
          id: generateId(),
          sourceVersionId: sourceId,
          targetVersionId: targetId,
          status: 'pending',
          conflicts,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          mergeRequests: { ...state.mergeRequests, [request.id]: request },
        }));

        return request;
      },

      resolveConflict: (mergeId, conflictPath, resolution) => {
        set((state) => {
          const request = state.mergeRequests[mergeId];
          if (!request) return state;
          
          const updatedConflicts = request.conflicts.map((c) =>
            c.path === conflictPath ? { ...c, resolvedValue: resolution } : c
          );
          
          return {
            mergeRequests: {
              ...state.mergeRequests,
              [mergeId]: { ...request, conflicts: updatedConflicts },
            },
          };
        });
      },

      completeMerge: (mergeId) => {
        const request = get().mergeRequests[mergeId];
        if (!request) return null;
        
        // Check all conflicts resolved
        const unresolved = request.conflicts.filter((c) => c.resolvedValue === undefined);
        if (unresolved.length > 0) {
          throw new Error(`${unresolved.length} conflicts not resolved`);
        }
        
        const source = get().versions[request.sourceVersionId];
        const target = get().versions[request.targetVersionId];
        
        if (!source || !target) return null;
        
        // Build merged content
        let mergedContent = { ...(target.content as object) };
        request.conflicts.forEach((conflict) => {
          // Apply resolution (simplified - would need proper path handling)
          const keys = conflict.path.split('.');
          let obj = mergedContent as Record<string, unknown>;
          for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]] as Record<string, unknown>;
          }
          obj[keys[keys.length - 1]] = conflict.resolvedValue;
        });
        
        // Create new version from merge
        const newVersion = get().createVersion({
          sphereId: target.sphereId,
          entityType: target.entityType,
          entityId: target.entityId,
          content: mergedContent,
          contentType: target.contentType,
          source: 'merge',
          description: `Merged from v${source.versionNumber} into v${target.versionNumber}`,
        });
        
        // Update merge request
        set((state) => ({
          mergeRequests: {
            ...state.mergeRequests,
            [mergeId]: {
              ...request,
              status: 'resolved',
              resolvedContent: mergedContent,
              resolvedAt: new Date().toISOString(),
            },
          },
        }));
        
        return newVersion;
      },

      // ─────────────────────────────────────────────────────────
      // Branching
      // ─────────────────────────────────────────────────────────
      createBranch: (fromVersionId, branchName) => {
        const source = get().versions[fromVersionId];
        if (!source) throw new Error('Source version not found');
        
        return get().createVersion({
          sphereId: source.sphereId,
          entityType: source.entityType,
          entityId: `${source.entityId}_${branchName}`,
          content: source.content,
          contentType: source.contentType,
          source: 'user',
          branchName,
          description: `Branch from v${source.versionNumber}`,
        });
      },

      // ─────────────────────────────────────────────────────────
      // Restore - No overwrite without explicit confirmation
      // ─────────────────────────────────────────────────────────
      restoreVersion: (versionId, confirm) => {
        if (!confirm) {
          throw new Error('Restore requires explicit confirmation');
        }
        
        const version = get().versions[versionId];
        if (!version) return null;
        
        // Create new version with restored content (doesn't overwrite history)
        return get().createVersion({
          sphereId: version.sphereId,
          entityType: version.entityType,
          entityId: version.entityId,
          content: version.content,
          contentType: version.contentType,
          source: 'user',
          description: `Restored from v${version.versionNumber}`,
          label: `Restored from v${version.versionNumber}`,
        });
      },
    }),
    {
      name: 'chenu-versions-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useVersionHistory = (entityId: string) => 
  useVersionStore((s) => s.getVersionHistory(entityId));

export const useLatestVersion = (entityId: string) =>
  useVersionStore((s) => s.getLatestVersion(entityId));

export const usePendingMerges = () =>
  useVersionStore((s) => 
    Object.values(s.mergeRequests).filter((m) => m.status === 'pending')
  );

export default useVersionStore;

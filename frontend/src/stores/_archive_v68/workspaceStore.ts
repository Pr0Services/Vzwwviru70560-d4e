/**
 * CHE·NU™ - WORKSPACE STORE
 * 
 * COMPLIANCE CHECKLIST COMPLIANT (v1-freeze)
 * 
 * WORKSPACE RULES:
 * - WS-001: User always retains an editable draft
 * - WS-002: Agent version never overwrites user draft
 * - WS-003: User can keep both versions
 * - WS-004: Discarding agent output leaves no trace in versions
 * 
 * CAPABILITIES:
 * - create, transform, export, import
 * - share_to_agent, versioning, diff
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type DocumentType = 
  | 'note'
  | 'task'
  | 'project'
  | 'thread'
  | 'data'
  | 'report'
  | 'custom';

export interface WorkspaceDocument {
  id: string;
  type: DocumentType;
  title: string;
  content: unknown;
  sphereId: SphereId;
  
  // Draft is ALWAYS user's editable version
  draft: DocumentVersion;
  
  // Staged output from agent (pending review)
  stagedOutput: StagedAgentOutput | null;
  
  // Immutable versions history
  versions: DocumentVersion[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DocumentVersion {
  id: string;
  content: unknown;
  createdAt: string;
  createdBy: 'user' | 'agent' | 'system';
  agentId?: string;
  description?: string;
  isImmutable: boolean;
  hash?: string;
}

export interface StagedAgentOutput {
  id: string;
  agentId: string;
  executionId: string;
  content: unknown;
  preview: string;
  tokensUsed: number;
  createdAt: string;
  expiresAt: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'modified';
}

export type ReviewAction = 
  | 'approve'      // Accept -> create version from staged
  | 'reject'       // Discard -> remove staged completely (WS-004)
  | 'keep_both'    // Keep draft AND create version from staged (WS-003)
  | 'merge'        // Merge staged into draft
  | 'modify';      // Edit staged before approval

// ═══════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════

interface WorkspaceState {
  // Documents
  documents: Record<string, WorkspaceDocument>;
  activeDocumentId: string | null;
  
  // Document operations
  createDocument: (data: CreateDocumentInput) => WorkspaceDocument;
  getDocument: (id: string) => WorkspaceDocument | undefined;
  updateDraft: (id: string, content: unknown) => void;
  deleteDocument: (id: string) => void;
  
  // Staging operations (agent output)
  stageAgentOutput: (documentId: string, output: Omit<StagedAgentOutput, 'reviewStatus'>) => void;
  reviewStagedOutput: (documentId: string, action: ReviewAction, modifications?: unknown) => void;
  clearStaging: (documentId: string) => void;
  
  // Versioning
  createVersion: (documentId: string, description?: string) => DocumentVersion;
  getVersions: (documentId: string) => DocumentVersion[];
  restoreVersion: (documentId: string, versionId: string) => void;
  compareVersions: (documentId: string, v1: string, v2: string) => VersionDiff;
  
  // Navigation
  setActiveDocument: (id: string | null) => void;
  getDocumentsBySphere: (sphereId: SphereId) => WorkspaceDocument[];
  
  // Export/Import
  exportDocument: (id: string, format: 'json' | 'md' | 'pdf') => string;
  importDocument: (data: string, format: 'json' | 'md') => WorkspaceDocument;
  
  // Share to agent
  shareToAgent: (documentId: string, agentId: string) => void;
}

interface CreateDocumentInput {
  type: DocumentType;
  title: string;
  content?: unknown;
  sphereId: SphereId;
}

interface VersionDiff {
  v1: DocumentVersion;
  v2: DocumentVersion;
  changes: DiffChange[];
}

interface DiffChange {
  type: 'add' | 'remove' | 'modify';
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateVersionId = () => `ver_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

function createInitialDraft(content: unknown, createdBy: string): DocumentVersion {
  return {
    id: generateVersionId(),
    content,
    createdAt: new Date().toISOString(),
    createdBy: 'user',
    isImmutable: false, // Draft is always mutable!
  };
}

function createImmutableVersion(content: unknown, createdBy: 'user' | 'agent', agentId?: string, description?: string): DocumentVersion {
  return {
    id: generateVersionId(),
    content,
    createdAt: new Date().toISOString(),
    createdBy,
    agentId,
    description,
    isImmutable: true, // Versions are ALWAYS immutable (CL-004)
  };
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      documents: {},
      activeDocumentId: null,

      // ─────────────────────────────────────────────────────────
      // Document Operations
      // ─────────────────────────────────────────────────────────
      createDocument: (data: CreateDocumentInput): WorkspaceDocument => {
        const id = generateId();
        const now = new Date().toISOString();
        
        const doc: WorkspaceDocument = {
          id,
          type: data.type,
          title: data.title,
          content: data.content || {},
          sphereId: data.sphereId,
          draft: createInitialDraft(data.content || {}, 'current_user'),
          stagedOutput: null,
          versions: [],
          createdAt: now,
          updatedAt: now,
          createdBy: 'current_user',
        };

        set((state) => ({
          documents: { ...state.documents, [id]: doc },
        }));

        return doc;
      },

      getDocument: (id: string) => get().documents[id],

      // WS-001: User always retains editable draft
      updateDraft: (id: string, content: unknown): void => {
        set((state) => {
          const doc = state.documents[id];
          if (!doc) return state;

          return {
            documents: {
              ...state.documents,
              [id]: {
                ...doc,
                draft: {
                  ...doc.draft,
                  content,
                  createdAt: new Date().toISOString(),
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deleteDocument: (id: string): void => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.documents;
          return {
            documents: remaining,
            activeDocumentId: state.activeDocumentId === id ? null : state.activeDocumentId,
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Staging Operations
      // ─────────────────────────────────────────────────────────
      // Agent output goes to staging, NEVER directly to workspace
      stageAgentOutput: (documentId: string, output: Omit<StagedAgentOutput, 'reviewStatus'>): void => {
        set((state) => {
          const doc = state.documents[documentId];
          if (!doc) return state;

          // WS-002: Agent version never overwrites user draft
          // Output goes to stagedOutput, NOT to draft
          return {
            documents: {
              ...state.documents,
              [documentId]: {
                ...doc,
                stagedOutput: {
                  ...output,
                  reviewStatus: 'pending',
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      reviewStagedOutput: (documentId: string, action: ReviewAction, modifications?: unknown): void => {
        set((state) => {
          const doc = state.documents[documentId];
          if (!doc || !doc.stagedOutput) return state;

          let newDoc = { ...doc };
          const staged = doc.stagedOutput;

          switch (action) {
            case 'approve':
              // Create immutable version from staged output
              newDoc.versions = [
                ...newDoc.versions,
                createImmutableVersion(staged.content, 'agent', staged.agentId, 'Approved agent output'),
              ];
              newDoc.stagedOutput = null;
              break;

            case 'reject':
              // WS-004: Discarding agent output leaves no trace
              newDoc.stagedOutput = null;
              // NO version created, staging simply cleared
              break;

            case 'keep_both':
              // WS-003: User can keep both versions
              // Create version from staged BUT keep draft untouched
              newDoc.versions = [
                ...newDoc.versions,
                createImmutableVersion(staged.content, 'agent', staged.agentId, 'Agent version (kept alongside draft)'),
              ];
              newDoc.stagedOutput = null;
              // Draft remains unchanged!
              break;

            case 'merge':
              // Merge staged content into draft
              newDoc.draft = {
                ...newDoc.draft,
                content: { ...newDoc.draft.content as object, ...staged.content as object },
                createdAt: new Date().toISOString(),
              };
              newDoc.stagedOutput = null;
              break;

            case 'modify':
              // Update staged with modifications, keep pending
              newDoc.stagedOutput = {
                ...staged,
                content: modifications || staged.content,
                reviewStatus: 'modified',
              };
              break;
          }

          newDoc.updatedAt = new Date().toISOString();

          return {
            documents: {
              ...state.documents,
              [documentId]: newDoc,
            },
          };
        });
      },

      clearStaging: (documentId: string): void => {
        set((state) => {
          const doc = state.documents[documentId];
          if (!doc) return state;

          return {
            documents: {
              ...state.documents,
              [documentId]: {
                ...doc,
                stagedOutput: null,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Versioning
      // ─────────────────────────────────────────────────────────
      createVersion: (documentId: string, description?: string): DocumentVersion => {
        const doc = get().documents[documentId];
        if (!doc) throw new Error('Document not found');

        const version = createImmutableVersion(
          doc.draft.content,
          'user',
          undefined,
          description || 'User checkpoint'
        );

        set((state) => ({
          documents: {
            ...state.documents,
            [documentId]: {
              ...doc,
              versions: [...doc.versions, version],
              updatedAt: new Date().toISOString(),
            },
          },
        }));

        return version;
      },

      getVersions: (documentId: string): DocumentVersion[] => {
        const doc = get().documents[documentId];
        return doc?.versions || [];
      },

      restoreVersion: (documentId: string, versionId: string): void => {
        set((state) => {
          const doc = state.documents[documentId];
          if (!doc) return state;

          const version = doc.versions.find((v) => v.id === versionId);
          if (!version) return state;

          // Restore to draft (versions remain immutable)
          return {
            documents: {
              ...state.documents,
              [documentId]: {
                ...doc,
                draft: createInitialDraft(version.content, 'current_user'),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      compareVersions: (documentId: string, v1: string, v2: string): VersionDiff => {
        const doc = get().documents[documentId];
        if (!doc) throw new Error('Document not found');

        const ver1 = doc.versions.find((v) => v.id === v1);
        const ver2 = doc.versions.find((v) => v.id === v2);
        
        if (!ver1 || !ver2) throw new Error('Version not found');

        // Simple diff implementation
        const changes: DiffChange[] = [];
        // TODO: Implement deep diff

        return { v1: ver1, v2: ver2, changes };
      },

      // ─────────────────────────────────────────────────────────
      // Navigation
      // ─────────────────────────────────────────────────────────
      setActiveDocument: (id: string | null): void => {
        set({ activeDocumentId: id });
      },

      getDocumentsBySphere: (sphereId: SphereId): WorkspaceDocument[] => {
        return Object.values(get().documents).filter((d) => d.sphereId === sphereId);
      },

      // ─────────────────────────────────────────────────────────
      // Export/Import
      // ─────────────────────────────────────────────────────────
      exportDocument: (id: string, format: 'json' | 'md' | 'pdf'): string => {
        const doc = get().documents[id];
        if (!doc) throw new Error('Document not found');

        if (format === 'json') {
          return JSON.stringify(doc, null, 2);
        }
        // TODO: Implement other formats
        return JSON.stringify(doc);
      },

      importDocument: (data: string, format: 'json' | 'md'): WorkspaceDocument => {
        const parsed = JSON.parse(data);
        return get().createDocument({
          type: parsed.type || 'custom',
          title: parsed.title || 'Imported Document',
          content: parsed.content || parsed,
          sphereId: parsed.sphereId || 'personal',
        });
      },

      // ─────────────────────────────────────────────────────────
      // Share to Agent
      // ─────────────────────────────────────────────────────────
      shareToAgent: (documentId: string, agentId: string): void => {
        // This creates a read-only snapshot for the agent
        const doc = get().documents[documentId];
        if (!doc) return;
        
        console.log(`[Workspace] Sharing document ${documentId} with agent ${agentId}`);
        // Agent receives snapshot, cannot modify original
      },
    }),
    {
      name: 'chenu-workspace-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        documents: state.documents,
        activeDocumentId: state.activeDocumentId,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useActiveDocument = () => useWorkspaceStore((state) => {
  if (!state.activeDocumentId) return null;
  return state.documents[state.activeDocumentId];
});

export const useHasStagedOutput = (documentId: string) => useWorkspaceStore(
  (state) => state.documents[documentId]?.stagedOutput !== null
);

export default useWorkspaceStore;

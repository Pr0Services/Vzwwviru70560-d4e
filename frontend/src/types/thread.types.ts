// =============================================================================
// CHE·NU™ — THREAD SYSTEM (.chenu)
// Version Finale V52
// Threads are FIRST-CLASS OBJECTS in CHE·NU
// =============================================================================

import { SphereId } from './sphere.types';

// =============================================================================
// THREAD TYPES
// =============================================================================

/**
 * Thread (.chenu) - A persistent line of thought
 * 
 * A thread:
 * - represents a persistent line of thought
 * - has an owner and scope
 * - has a token budget
 * - has encoding rules
 * - records decisions and history
 * - is auditable
 */

export type ThreadStatus = 
  | 'active'      // Currently in use
  | 'paused'      // Temporarily suspended
  | 'completed'   // Finished, archived
  | 'archived';   // Long-term storage

export type ThreadScope = 
  | 'personal'    // Only owner can access
  | 'sphere'      // Visible within sphere
  | 'team'        // Shared with team members
  | 'public';     // Visible to all (within identity)

export type ThreadPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ThreadTokenBudget {
  allocated: number;      // Initial budget
  consumed: number;       // Used so far
  remaining: number;      // Available
  limit: number;          // Max allowed
  rateLimit: number;      // Per minute
}

export interface ThreadParticipant {
  type: 'user' | 'agent';
  id: string;
  name: string;
  role: 'owner' | 'contributor' | 'viewer';
  joinedAt: string;
}

export interface ThreadDecision {
  id: string;
  timestamp: string;
  type: 'approval' | 'rejection' | 'modification' | 'escalation';
  description: string;
  madeBy: ThreadParticipant;
  reasoning?: string;
  governanceRef?: string;
}

export interface ThreadMessage {
  id: string;
  timestamp: string;
  sender: ThreadParticipant;
  content: string;
  contentEncoded?: string;  // Encoded version for efficiency
  tokenCount: number;
  attachments?: string[];
  replyTo?: string;
}

export interface ThreadMetadata {
  created: string;
  updated: string;
  lastActivity: string;
  messageCount: number;
  decisionCount: number;
  totalTokens: number;
  averageResponseTime?: number;
}

export interface Thread {
  id: string;
  title: string;
  description?: string;
  
  // Ownership & Scope
  ownerId: string;
  sphereId: SphereId;
  scope: ThreadScope;
  
  // Status
  status: ThreadStatus;
  priority: ThreadPriority;
  
  // Token Management
  tokenBudget: ThreadTokenBudget;
  
  // Participants
  participants: ThreadParticipant[];
  
  // Content
  messages: ThreadMessage[];
  decisions: ThreadDecision[];
  
  // Metadata
  metadata: ThreadMetadata;
  
  // Tags & Classification
  tags: string[];
  domain?: string;
  projectRef?: string;
  
  // Encoding
  encodingProfile?: string;
  qualityScore?: number;
  
  // Audit
  auditTrail: string[];  // Hash chain
}

// =============================================================================
// THREAD CREATION
// =============================================================================

export interface CreateThreadInput {
  title: string;
  description?: string;
  sphereId: SphereId;
  scope?: ThreadScope;
  priority?: ThreadPriority;
  tokenBudget?: Partial<ThreadTokenBudget>;
  tags?: string[];
  domain?: string;
  projectRef?: string;
}

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

// =============================================================================
// THREAD ACTIONS
// =============================================================================

export type ThreadAction =
  | { type: 'SEND_MESSAGE'; content: string; attachments?: string[] }
  | { type: 'MAKE_DECISION'; decision: Omit<ThreadDecision, 'id' | 'timestamp'> }
  | { type: 'UPDATE_STATUS'; status: ThreadStatus }
  | { type: 'UPDATE_PRIORITY'; priority: ThreadPriority }
  | { type: 'UPDATE_SCOPE'; scope: ThreadScope }
  | { type: 'ADD_PARTICIPANT'; participant: Omit<ThreadParticipant, 'joinedAt'> }
  | { type: 'REMOVE_PARTICIPANT'; participantId: string }
  | { type: 'ADJUST_BUDGET'; budget: Partial<ThreadTokenBudget> }
  | { type: 'ADD_TAG'; tag: string }
  | { type: 'REMOVE_TAG'; tag: string }
  | { type: 'ARCHIVE' };

// =============================================================================
// THREAD CONFIG
// =============================================================================

export const THREAD_CONFIG = {
  // Default token budget
  defaultBudget: {
    allocated: 10000,
    consumed: 0,
    remaining: 10000,
    limit: 50000,
    rateLimit: 100,
  },
  
  // Scope visibility rules
  scopeRules: {
    personal: ['owner'],
    sphere: ['owner', 'sphere_members'],
    team: ['owner', 'team_members'],
    public: ['owner', 'all_members'],
  },
  
  // File extension
  fileExtension: '.chenu',
  
  // Max participants per thread
  maxParticipants: 50,
  
  // Max messages before archiving suggestion
  archiveSuggestionThreshold: 500,
  
  // Quality score thresholds
  qualityThresholds: {
    excellent: 90,
    good: 70,
    fair: 50,
    poor: 30,
  },
} as const;

// =============================================================================
// THREAD HELPERS
// =============================================================================

export function createThread(input: CreateThreadInput, ownerId: string): Thread {
  const now = new Date().toISOString();
  const id = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const tokenBudget: ThreadTokenBudget = {
    ...THREAD_CONFIG.defaultBudget,
    ...input.tokenBudget,
  };
  tokenBudget.remaining = tokenBudget.allocated - tokenBudget.consumed;
  
  return {
    id,
    title: input.title,
    description: input.description,
    ownerId,
    sphereId: input.sphereId,
    scope: input.scope || 'personal',
    status: 'active',
    priority: input.priority || 'medium',
    tokenBudget,
    participants: [
      {
        type: 'user',
        id: ownerId,
        name: 'Owner',
        role: 'owner',
        joinedAt: now,
      },
    ],
    messages: [],
    decisions: [],
    metadata: {
      created: now,
      updated: now,
      lastActivity: now,
      messageCount: 0,
      decisionCount: 0,
      totalTokens: 0,
    },
    tags: input.tags || [],
    domain: input.domain,
    projectRef: input.projectRef,
    auditTrail: [],
  };
}

export function getThreadFilename(thread: Thread): string {
  const sanitized = thread.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .substring(0, 50);
  return `${sanitized}_${thread.id}${THREAD_CONFIG.fileExtension}`;
}

export function canUserAccessThread(
  thread: Thread, 
  userId: string, 
  userSpheres: SphereId[]
): boolean {
  // Owner always has access
  if (thread.ownerId === userId) return true;
  
  // Check participant list
  const isParticipant = thread.participants.some(p => p.id === userId);
  
  switch (thread.scope) {
    case 'personal':
      return false;
    case 'sphere':
      return userSpheres.includes(thread.sphereId);
    case 'team':
      return isParticipant;
    case 'public':
      return true;
    default:
      return false;
  }
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export function getThreadQualityLabel(score: number): string {
  if (score >= THREAD_CONFIG.qualityThresholds.excellent) return 'Excellent';
  if (score >= THREAD_CONFIG.qualityThresholds.good) return 'Bon';
  if (score >= THREAD_CONFIG.qualityThresholds.fair) return 'Moyen';
  return 'À améliorer';
}

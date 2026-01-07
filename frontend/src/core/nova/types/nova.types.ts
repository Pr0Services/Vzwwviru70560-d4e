/**
 * CHE·NU™ — Nova Types
 * Types pour le système Nova
 */

// ═══════════════════════════════════════════════════════════════════════════════
// USER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  preferences?: NovaUserPreferences;
}

export interface NovaUserPreferences {
  language: 'fr' | 'en';
  voiceEnabled: boolean;
  suggestionsEnabled: boolean;
  tutorialsCompleted: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE & SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export type NovaSphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team';

export interface NovaSphere {
  id: NovaSphereId;
  name: string;
  icon: string;
  color: string;
}

export type NovaSectionId = 
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'projects'
  | 'threads'
  | 'meetings'
  | 'data'
  | 'agents'
  | 'reports'
  | 'budget';

export interface NovaSection {
  id: NovaSectionId;
  name: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaMessage {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    sphereId?: NovaSphereId;
    sectionId?: NovaSectionId;
    tokens?: number;
  };
}

export interface NovaConversation {
  id: string;
  messages: NovaMessage[];
  context: NovaContext;
  createdAt: string;
  updatedAt: string;
}

export interface NovaContext {
  sphereId?: NovaSphereId;
  sectionId?: NovaSectionId;
  threadId?: string;
  agentId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIONS & SUGGESTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaAction {
  id: string;
  type: 'navigate' | 'create' | 'update' | 'delete' | 'execute';
  target: string;
  params?: Record<string, unknown>;
  requiresConfirmation: boolean;
}

export interface NovaSuggestion {
  id: string;
  text: string;
  action: NovaAction;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  currentConversation?: NovaConversation;
  suggestions: NovaSuggestion[];
  pendingActions: NovaAction[];
}

export type NovaEventType = 
  | 'message'
  | 'suggestion'
  | 'action'
  | 'error'
  | 'state_change';

export interface NovaEvent {
  type: NovaEventType;
  payload: unknown;
  timestamp: string;
}

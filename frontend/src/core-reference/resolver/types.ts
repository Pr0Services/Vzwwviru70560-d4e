/**
 * CHE·NU - Resolver Types
 * Types pour le système de résolution de pages
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PageConfig {
  id: string;
  path: string;
  title: string;
  layout: 'default' | 'full' | 'sidebar' | 'centered';
  components: ComponentConfig[];
}

export interface ComponentConfig {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentConfig[];
}

export interface ResolverContext {
  sphereId?: string;
  userId?: string;
  permissions: string[];
}

export interface ResolvedPage {
  config: PageConfig;
  data: Record<string, unknown>;
  ready: boolean;
}

export type PageResolver = (context: ResolverContext) => Promise<ResolvedPage>;

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SphereConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  enabled: boolean;
  order: number;
}

export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'expert';

export type PermissionLevel = 'read' | 'write' | 'admin' | 'owner';

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT TYPES  
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentConfig {
  id: string;
  name: string;
  type: 'assistant' | 'analyzer' | 'executor' | 'orchestrator';
  capabilities: string[];
  permissions: PermissionLevel;
  complexity: ComplexityLevel;
}

export interface AgentState {
  status: 'idle' | 'working' | 'waiting' | 'error';
  currentTask?: string;
  lastActivity?: Date;
}

/**
 * CHE·NU™ SDK — Legacy Compatibility Stub
 * Ce module fournit des stubs pour la compatibilité legacy
 * Les vrais modules sont dans sdk/ et core/
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CORE SYSTEM STUBS
// ═══════════════════════════════════════════════════════════════════════════════

export class Orchestrator {
  static instance: Orchestrator;
  static getInstance(): Orchestrator { return this.instance || (this.instance = new Orchestrator()); }
}

export class ContextInterpreter {
  interpret(context: unknown): unknown { return context; }
}

export class HyperFabric {
  nodes: FabricNode[] = [];
  connections: FabricConnection[] = [];
}

export class DepthLensSystem {
  currentDepth: number = 0;
  setDepth(depth: number): void { this.currentDepth = depth; }
}

export class AgentSwarm {
  agents: unknown[] = [];
  spawn(): void {}
}

export class EthicsEngine {
  validate(): boolean { return true; }
}

export class RoleManager {
  roles: unknown[] = [];
}

export class PermissionEngine {
  check(): boolean { return true; }
}

export class TokenVault {
  balance: number = 0;
}

export class MemorySystem {
  items: MemoryItem[] = [];
}

export class ReplayEngine {
  sessions: ReplaySession[] = [];
}

export class AnalyticsCollector {
  collect(): void {}
}

export class XRRenderer {
  render(): void {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface XRSceneConfig {
  id: string;
  name: string;
  type: string;
}

export interface FabricNode {
  id: string;
  type: string;
  data: unknown;
}

export interface FabricConnection {
  id: string;
  source: string;
  target: string;
}

export interface MemoryItem {
  id: string;
  type: string;
  content: unknown;
  timestamp: string;
}

export interface ReplaySession {
  id: string;
  startTime: string;
  endTime?: string;
  events: unknown[];
}

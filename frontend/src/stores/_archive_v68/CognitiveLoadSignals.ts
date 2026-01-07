/**
 * CHE·NU V51 — COGNITIVE LOAD SIGNALS
 * ====================================
 * 
 * System monitors DENSITY, not MEANING.
 * 
 * SIGNALS:
 * - number of active blocks
 * - estimated token load
 * - number of open spheres
 * - proposal count
 * 
 * OUTPUT:
 * - visual indicators only
 * - CLOSED / OPEN / LOADED states
 * - warnings (non-blocking)
 * 
 * STRICT RULES:
 * - NEVER auto-compact
 * - NEVER auto-hide information
 * 
 * PRINCIPLE: "Warn, but never interfere."
 */

// ============================================
// LOAD STATE
// ============================================

export type LoadState = 'closed' | 'open' | 'loaded' | 'warning';

// ============================================
// COGNITIVE LOAD SIGNALS
// ============================================

export interface CognitiveLoadSignals {
  /** Number of active canvas blocks */
  active_blocks: number;
  
  /** Estimated token count (approximation) */
  estimated_tokens: number;
  
  /** Number of currently open/focused spheres */
  open_spheres: number;
  
  /** Number of pending proposals */
  pending_proposals: number;
  
  /** Computed load state */
  load_state: LoadState;
  
  /** Active warnings (non-blocking) */
  warnings: LoadWarning[];
  
  /** Last updated timestamp */
  updated_at: string;
}

export interface LoadWarning {
  warning_id: string;
  type: 'token_limit' | 'block_count' | 'sphere_count' | 'proposal_count';
  message: string;
  threshold: number;
  current_value: number;
  severity: 'low' | 'medium' | 'high';
}

// ============================================
// THRESHOLDS (CONFIGURABLE)
// ============================================

export interface LoadThresholds {
  /** Token thresholds */
  tokens_open: number;
  tokens_loaded: number;
  tokens_warning: number;
  
  /** Block thresholds */
  blocks_open: number;
  blocks_loaded: number;
  blocks_warning: number;
  
  /** Sphere thresholds */
  spheres_open: number;
  spheres_loaded: number;
  spheres_warning: number;
  
  /** Proposal thresholds */
  proposals_loaded: number;
  proposals_warning: number;
}

export const DEFAULT_THRESHOLDS: LoadThresholds = {
  tokens_open: 1000,
  tokens_loaded: 5000,
  tokens_warning: 10000,
  
  blocks_open: 5,
  blocks_loaded: 15,
  blocks_warning: 30,
  
  spheres_open: 2,
  spheres_loaded: 5,
  spheres_warning: 10,
  
  proposals_loaded: 5,
  proposals_warning: 15
};

// ============================================
// COGNITIVE LOAD STORE
// ============================================

export class CognitiveLoadStore {
  private signals: CognitiveLoadSignals;
  private thresholds: LoadThresholds;
  private listeners: Set<(signals: CognitiveLoadSignals) => void> = new Set();

  constructor(thresholds: LoadThresholds = DEFAULT_THRESHOLDS) {
    this.thresholds = thresholds;
    this.signals = this.createInitialSignals();
  }

  private createInitialSignals(): CognitiveLoadSignals {
    return {
      active_blocks: 0,
      estimated_tokens: 0,
      open_spheres: 0,
      pending_proposals: 0,
      load_state: 'closed',
      warnings: [],
      updated_at: new Date().toISOString()
    };
  }

  // ----------------------------------------
  // UPDATE SIGNALS
  // ----------------------------------------

  update(partial: Partial<Omit<CognitiveLoadSignals, 'load_state' | 'warnings' | 'updated_at'>>): void {
    // Apply updates
    if (partial.active_blocks !== undefined) {
      this.signals.active_blocks = partial.active_blocks;
    }
    if (partial.estimated_tokens !== undefined) {
      this.signals.estimated_tokens = partial.estimated_tokens;
    }
    if (partial.open_spheres !== undefined) {
      this.signals.open_spheres = partial.open_spheres;
    }
    if (partial.pending_proposals !== undefined) {
      this.signals.pending_proposals = partial.pending_proposals;
    }

    // Recompute state and warnings
    this.recompute();
    
    // Notify listeners
    this.notifyListeners();
  }

  // ----------------------------------------
  // INDIVIDUAL UPDATES
  // ----------------------------------------

  setActiveBlocks(count: number): void {
    this.update({ active_blocks: count });
  }

  setEstimatedTokens(count: number): void {
    this.update({ estimated_tokens: count });
  }

  setOpenSpheres(count: number): void {
    this.update({ open_spheres: count });
  }

  setPendingProposals(count: number): void {
    this.update({ pending_proposals: count });
  }

  incrementBlocks(): void {
    this.update({ active_blocks: this.signals.active_blocks + 1 });
  }

  decrementBlocks(): void {
    this.update({ active_blocks: Math.max(0, this.signals.active_blocks - 1) });
  }

  // ----------------------------------------
  // RECOMPUTE STATE & WARNINGS
  // ----------------------------------------

  private recompute(): void {
    const warnings: LoadWarning[] = [];
    let maxState: LoadState = 'closed';

    const { active_blocks, estimated_tokens, open_spheres, pending_proposals } = this.signals;
    const t = this.thresholds;

    // Check tokens
    if (estimated_tokens >= t.tokens_warning) {
      warnings.push({
        warning_id: `warn_tokens_${Date.now()}`,
        type: 'token_limit',
        message: `High token count: ${estimated_tokens} (threshold: ${t.tokens_warning})`,
        threshold: t.tokens_warning,
        current_value: estimated_tokens,
        severity: 'high'
      });
      maxState = 'warning';
    } else if (estimated_tokens >= t.tokens_loaded) {
      maxState = this.maxState(maxState, 'loaded');
    } else if (estimated_tokens >= t.tokens_open) {
      maxState = this.maxState(maxState, 'open');
    }

    // Check blocks
    if (active_blocks >= t.blocks_warning) {
      warnings.push({
        warning_id: `warn_blocks_${Date.now()}`,
        type: 'block_count',
        message: `Many active blocks: ${active_blocks} (threshold: ${t.blocks_warning})`,
        threshold: t.blocks_warning,
        current_value: active_blocks,
        severity: 'high'
      });
      maxState = 'warning';
    } else if (active_blocks >= t.blocks_loaded) {
      maxState = this.maxState(maxState, 'loaded');
    } else if (active_blocks >= t.blocks_open) {
      maxState = this.maxState(maxState, 'open');
    }

    // Check spheres
    if (open_spheres >= t.spheres_warning) {
      warnings.push({
        warning_id: `warn_spheres_${Date.now()}`,
        type: 'sphere_count',
        message: `Many open spheres: ${open_spheres} (threshold: ${t.spheres_warning})`,
        threshold: t.spheres_warning,
        current_value: open_spheres,
        severity: 'medium'
      });
      maxState = 'warning';
    } else if (open_spheres >= t.spheres_loaded) {
      maxState = this.maxState(maxState, 'loaded');
    } else if (open_spheres >= t.spheres_open) {
      maxState = this.maxState(maxState, 'open');
    }

    // Check proposals
    if (pending_proposals >= t.proposals_warning) {
      warnings.push({
        warning_id: `warn_proposals_${Date.now()}`,
        type: 'proposal_count',
        message: `Many pending proposals: ${pending_proposals} (threshold: ${t.proposals_warning})`,
        threshold: t.proposals_warning,
        current_value: pending_proposals,
        severity: 'medium'
      });
    } else if (pending_proposals >= t.proposals_loaded) {
      maxState = this.maxState(maxState, 'loaded');
    }

    this.signals.load_state = maxState;
    this.signals.warnings = warnings;
    this.signals.updated_at = new Date().toISOString();
  }

  private maxState(current: LoadState, candidate: LoadState): LoadState {
    const order: LoadState[] = ['closed', 'open', 'loaded', 'warning'];
    const currentIndex = order.indexOf(current);
    const candidateIndex = order.indexOf(candidate);
    return candidateIndex > currentIndex ? candidate : current;
  }

  // ----------------------------------------
  // GETTERS
  // ----------------------------------------

  getSignals(): Readonly<CognitiveLoadSignals> {
    return Object.freeze({ ...this.signals });
  }

  getLoadState(): LoadState {
    return this.signals.load_state;
  }

  getWarnings(): readonly LoadWarning[] {
    return Object.freeze([...this.signals.warnings]);
  }

  hasWarnings(): boolean {
    return this.signals.warnings.length > 0;
  }

  // ----------------------------------------
  // RESET
  // ----------------------------------------

  reset(): void {
    this.signals = this.createInitialSignals();
    this.notifyListeners();
  }

  // ----------------------------------------
  // LISTENERS
  // ----------------------------------------

  subscribe(listener: (signals: CognitiveLoadSignals) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const frozen = this.getSignals();
    this.listeners.forEach(listener => {
      try {
        listener(frozen);
      } catch (e) {
        console.error('Cognitive load listener error:', e);
      }
    });
  }

  // ----------------------------------------
  // THRESHOLDS
  // ----------------------------------------

  setThresholds(thresholds: Partial<LoadThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    this.recompute();
    this.notifyListeners();
  }

  getThresholds(): Readonly<LoadThresholds> {
    return Object.freeze({ ...this.thresholds });
  }
}

// ============================================
// SINGLETON INSTANCE (FOR DEMO)
// ============================================

let globalCognitiveLoadStore: CognitiveLoadStore | null = null;

export function getGlobalCognitiveLoadStore(): CognitiveLoadStore {
  if (!globalCognitiveLoadStore) {
    globalCognitiveLoadStore = new CognitiveLoadStore();
  }
  return globalCognitiveLoadStore;
}

export function resetGlobalCognitiveLoadStore(): void {
  globalCognitiveLoadStore?.reset();
  globalCognitiveLoadStore = null;
}

/**
 * CHE·NU V51 — USER PROFILE STATE
 * ================================
 * 
 * The system remembers HOW the user uses CHE·NU,
 * NOT WHAT they think.
 * 
 * STORED DATA:
 * - last_module_opened
 * - preferred_ui_mode
 * - reflection_room_usage_count
 * - last_incident_mode_activation
 * - last_session_timestamp
 * 
 * STRICT RULES:
 * - No content stored
 * - No inference
 * - No prediction
 * 
 * PRINCIPLE: "Remember behavior, not thought."
 */

import { getGlobalEventStore } from './SystemEventStore';

// ============================================
// USER PROFILE STATE
// ============================================

export interface UserProfileState {
  /** User identifier (anonymous in demo) */
  user_id: string;
  
  /** Last module the user opened */
  last_module_opened?: string;
  
  /** Preferred UI mode */
  preferred_ui_mode: 'light' | 'dark_strict' | 'incident';
  
  /** Number of times Reflection Room was used */
  reflection_room_usage_count: number;
  
  /** Last time Incident Mode was activated */
  last_incident_mode_activation?: string;
  
  /** Last session timestamp */
  last_session_timestamp: string;
  
  /** Session count */
  session_count: number;
  
  /** XR usage count */
  xr_usage_count: number;
  
  /** Total proposals reviewed */
  proposals_reviewed_count: number;
  
  /** Total proposals approved */
  proposals_approved_count: number;
  
  /** Total proposals discarded */
  proposals_discarded_count: number;
}

// ============================================
// USER PROFILE STORE
// ============================================

export class UserProfileStore {
  private state: UserProfileState;
  private listeners: Set<(state: UserProfileState) => void> = new Set();
  private storageKey: string;

  constructor(user_id: string = 'demo_user') {
    this.storageKey = `chenu_profile_${user_id}`;
    this.state = this.loadOrCreate(user_id);
  }

  // ----------------------------------------
  // LOAD OR CREATE
  // ----------------------------------------

  private loadOrCreate(user_id: string): UserProfileState {
    // Try to load from localStorage (if available)
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfileState;
          // Update session info
          parsed.last_session_timestamp = new Date().toISOString();
          parsed.session_count++;
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to load user profile:', e);
      }
    }

    // Create new profile
    return {
      user_id,
      last_module_opened: undefined,
      preferred_ui_mode: 'dark_strict',
      reflection_room_usage_count: 0,
      last_incident_mode_activation: undefined,
      last_session_timestamp: new Date().toISOString(),
      session_count: 1,
      xr_usage_count: 0,
      proposals_reviewed_count: 0,
      proposals_approved_count: 0,
      proposals_discarded_count: 0
    };
  }

  // ----------------------------------------
  // PERSIST
  // ----------------------------------------

  private persist(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to persist user profile:', e);
      }
    }
    this.notifyListeners();
  }

  // ----------------------------------------
  // UPDATE METHODS (EXPLICIT USER ACTIONS ONLY)
  // ----------------------------------------

  recordModuleOpened(module_id: string): void {
    this.state.last_module_opened = module_id;
    
    if (module_id === 'reflection_room') {
      this.state.reflection_room_usage_count++;
    }
    
    this.persist();
  }

  setPreferredUIMode(mode: 'light' | 'dark_strict' | 'incident'): void {
    this.state.preferred_ui_mode = mode;
    this.persist();
  }

  recordIncidentModeActivation(): void {
    this.state.last_incident_mode_activation = new Date().toISOString();
    this.persist();
  }

  recordXRUsage(): void {
    this.state.xr_usage_count++;
    this.persist();
  }

  recordProposalReviewed(): void {
    this.state.proposals_reviewed_count++;
    this.persist();
  }

  recordProposalApproved(): void {
    this.state.proposals_approved_count++;
    this.persist();
  }

  recordProposalDiscarded(): void {
    this.state.proposals_discarded_count++;
    this.persist();
  }

  // ----------------------------------------
  // GETTERS
  // ----------------------------------------

  getState(): Readonly<UserProfileState> {
    return Object.freeze({ ...this.state });
  }

  getUserId(): string {
    return this.state.user_id;
  }

  getLastModuleOpened(): string | undefined {
    return this.state.last_module_opened;
  }

  getPreferredUIMode(): 'light' | 'dark_strict' | 'incident' {
    return this.state.preferred_ui_mode;
  }

  getReflectionRoomUsageCount(): number {
    return this.state.reflection_room_usage_count;
  }

  getSessionCount(): number {
    return this.state.session_count;
  }

  // ----------------------------------------
  // COMPUTED: DEFAULT ENTRY MODULE
  // ----------------------------------------

  /**
   * Determines the default entry module based on usage patterns.
   * User opens Reflection Room frequently → Reflection Room becomes default.
   */
  getDefaultEntryModule(): string {
    // If Reflection Room was used more than 3 times, make it default
    if (this.state.reflection_room_usage_count >= 3) {
      return 'reflection_room';
    }
    
    // Otherwise use last opened module or fallback to reflection_room
    return this.state.last_module_opened || 'reflection_room';
  }

  // ----------------------------------------
  // RESET (FOR DEMO)
  // ----------------------------------------

  reset(): void {
    this.state = {
      user_id: this.state.user_id,
      last_module_opened: undefined,
      preferred_ui_mode: 'dark_strict',
      reflection_room_usage_count: 0,
      last_incident_mode_activation: undefined,
      last_session_timestamp: new Date().toISOString(),
      session_count: 1,
      xr_usage_count: 0,
      proposals_reviewed_count: 0,
      proposals_approved_count: 0,
      proposals_discarded_count: 0
    };
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    
    this.notifyListeners();
  }

  // ----------------------------------------
  // LISTENERS
  // ----------------------------------------

  subscribe(listener: (state: UserProfileState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const frozen = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(frozen);
      } catch (e) {
        console.error('Profile listener error:', e);
      }
    });
  }

  // ----------------------------------------
  // EXPORT (FOR DEBUG/AUDIT)
  // ----------------------------------------

  exportToJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }
}

// ============================================
// SINGLETON INSTANCE (FOR DEMO)
// ============================================

let globalProfileStore: UserProfileStore | null = null;

export function getGlobalProfileStore(): UserProfileStore {
  if (!globalProfileStore) {
    globalProfileStore = new UserProfileStore('demo_user');
  }
  return globalProfileStore;
}

export function resetGlobalProfileStore(): void {
  globalProfileStore?.reset();
  globalProfileStore = null;
}

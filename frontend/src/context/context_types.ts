/**
 * CHE·NU™ — Context Types (Legacy Stub)
 */
export interface ContextConfig {
  sphereId: string;
  bureauId: string;
  mode: string;
}
export interface ContextState {
  current: ContextConfig | null;
  history: ContextConfig[];
}

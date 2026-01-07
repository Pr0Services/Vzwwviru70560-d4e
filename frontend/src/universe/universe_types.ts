/**
 * CHE·NU™ — Universe Types (Legacy Stub)
 */
export interface UniverseConfig {
  id: string;
  type: 'realistic' | 'ancient' | 'futurist' | 'cosmic';
  spheres: string[];
}
export interface UniverseState {
  current: string;
  theme: string;
}

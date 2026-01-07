/**
 * CHE·NU™ — Architecture Types (Legacy Stub)
 */
export interface ArchitectureConfig {
  version: string;
  modules: string[];
}
export interface ArchitectureProcess {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}
export interface ArchitectureEngine {
  id: string;
  type: string;
}
export interface ArchitectureTemplate {
  id: string;
  name: string;
  config: ArchitectureConfig;
}
export type ArchitectureXR = {
  enabled: boolean;
  mode: string;
};

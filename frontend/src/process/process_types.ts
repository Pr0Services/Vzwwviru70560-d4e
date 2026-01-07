/**
 * CHE·NU™ — Process Types (Legacy Stub)
 */
export interface ProcessConfig {
  id: string;
  name: string;
  steps: string[];
}
export interface ProcessState {
  currentStep: number;
  status: 'pending' | 'running' | 'complete' | 'error';
}

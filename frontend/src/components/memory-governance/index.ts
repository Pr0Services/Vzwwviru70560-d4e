/**
 * CHE·NU™ Memory Governance Module
 * User data control, retention policies, and privacy management
 * 
 * @module memory-governance
 * @version 33.0
 */

export { default as MemoryGovernance } from './MemoryGovernance';

// Types
export type DataCategory = 'conversations' | 'documents' | 'decisions' | 'analytics' | 'preferences' | 'agents';
export type RetentionPeriod = '30_days' | '90_days' | '1_year' | '3_years' | 'indefinite';
export type PrivacyLevel = 'public' | 'shared' | 'private' | 'encrypted';

// Constants
export const DATA_CATEGORIES = [
  'conversations', 'documents', 'decisions', 
  'analytics', 'preferences', 'agents'
] as const;

export const RETENTION_PERIODS = [
  '30_days', '90_days', '1_year', '3_years', 'indefinite'
] as const;

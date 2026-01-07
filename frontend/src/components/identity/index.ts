/**
 * CHE·NU™ Identity Management Module
 * Multi-identity management with isolation and governance
 * 
 * @module identity
 * @version 33.0
 */

export { default as IdentityManager } from './IdentityManager';

// Types
export type IdentityType = 'personal' | 'business' | 'organization' | 'trust';

export interface Identity {
  id: string;
  name: string;
  type: IdentityType;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  lastAccessedAt: string;
}

// Constants
export const IDENTITY_TYPES = ['personal', 'business', 'organization', 'trust'] as const;

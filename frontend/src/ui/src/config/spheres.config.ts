/**
 * CHE·NU™ — Spheres Configuration
 * 
 * Re-export depuis universeAdapter pour compatibilité
 */

export * from '../adapters/universeAdapter';
export {
  ROOT_SPHERES,
  getSphereIcon,
  getSphereLabel,
  getSphereColor,
  getDomainsForSphere,
  getEnginesForSphere,
  getSphereDescription
} from '../adapters/universeAdapter';

export type { RootSphere } from '../adapters/universeAdapter';

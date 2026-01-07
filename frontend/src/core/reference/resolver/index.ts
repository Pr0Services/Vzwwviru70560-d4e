/* =====================================================
   CHE·NU — Dimension Resolver Module
   
   PURE, FRAMEWORK-AGNOSTIC MODULE
   
   Usage:
   
   import { resolveDimension } from './resolver';
   import engineConfig from '../dimension.engine.json';
   
   const dimension = resolveDimension(context, engineConfig);
   
   ===================================================== */

// Types
export * from './types';

// Main Resolver
export {
  default as resolveDimension,
  normalizeContext,
  resolveContent,
  resolveActivity,
  resolveComplexity,
  resolvePermission,
  resolveDepth,
  resolveMotion,
  resolveDensity,
  computeScale,
  computeVisibility,
} from './dimensionResolver';

// Tests
export { default as runTests } from './dimensionResolver.test';

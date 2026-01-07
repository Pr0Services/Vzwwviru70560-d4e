/**
 * CHE·NU — SURFACES (Legacy)
 * ============================================================
 * 
 * DEPRECATED: Use zones instead
 * - ZoneInteraction (was SurfaceNova)
 * - ZoneNavigation (was SurfaceSpheres)
 * - ZoneConception (was SurfaceWorkspace)
 * 
 * @deprecated Use @/components/zones instead
 */

// Legacy exports for backward compatibility
export { AppHeader } from '@/components/layout/AppHeader'
export { SurfaceNova } from './SurfaceNova'
export { SurfaceSpheres } from './SurfaceSpheres'
export { SurfaceWorkspace } from './SurfaceWorkspace'

// New architecture
export * from '@/components/zones'

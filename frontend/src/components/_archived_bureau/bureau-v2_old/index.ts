/**
 * CHE·NU™ Bureau System v2
 * 5-Level Bureau Hierarchy with 6-Section Sphere Bureau
 * 
 * FROZEN ARCHITECTURE - DO NOT MODIFY STRUCTURE
 * 
 * @module bureau-v2
 * @version 33.0
 */

export { default as BureauSystem } from './BureauSystem';

// Re-export types
export type {
  BureauLevel,
  SphereCode,
  SphereBureauSectionType,
  BureauSection,
  Bureau,
  BureauNavigationState
} from './BureauSystem';

// Re-export constants
export {
  SPHERES,
  SPHERE_BUREAU_SECTIONS
} from './BureauSystem';

/**
 * BUREAU HIERARCHY (FROZEN)
 * 
 * L0: Global Bureau (5 sections)
 *   - identity_selector
 *   - recent_activity
 *   - pinned_workspaces
 *   - notifications
 *   - nova_entry
 * 
 * L1: Identity Bureau (4 sections)
 *   - identity_summary
 *   - active_spheres
 *   - identity_threads
 *   - budget_overview
 * 
 * L2: Sphere Bureau (6 sections MAX) ⚠️ HARD LIMIT
 *   - quick_capture
 *   - resume_workspace
 *   - threads
 *   - data_files
 *   - active_agents
 *   - meetings
 * 
 * L3: Project Bureau (4 sections)
 *   - project_overview
 *   - linked_workspaces
 *   - project_timeline
 *   - assigned_agents
 * 
 * L4: Agent Bureau (4 sections)
 *   - agent_status
 *   - agent_plans
 *   - staging_outputs
 *   - agent_history
 */

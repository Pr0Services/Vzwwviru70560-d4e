/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — XR DECISION ROOM CANONICAL (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES ABSOLUES:
 * - XR is a SPATIAL MIRROR only
 * - XR adds ZERO capability
 * - NO extra interaction in XR
 * - NO narrative layer
 * - XR shows EXACTLY what standard UI shows
 * - All actions available in XR MUST be available in standard UI
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * XR COMPLIANCE RULES
 */
export const XR_COMPLIANCE = {
  // XR is ONLY a spatial mirror
  SPATIAL_MIRROR_ONLY: true,
  
  // XR adds ZERO capability
  ZERO_ADDITIONAL_CAPABILITY: true,
  
  // NO extra interactions in XR
  NO_EXTRA_INTERACTIONS: true,
  
  // NO narrative or storytelling
  NO_NARRATIVE: true,
  
  // NO immersive features beyond visualization
  NO_IMMERSIVE_FEATURES: true,
  
  // Everything in XR exists in standard UI
  MIRRORS_STANDARD_UI: true
} as const;

/**
 * XR Room State - Same as standard UI
 */
export type XRRoomState = 'loading' | 'ready' | 'closed';

/**
 * XR ALLOWED INTERACTIONS
 * ONLY what standard UI allows.
 */
export const XR_INTERACTIONS = {
  // Allowed (same as standard UI)
  allowed: [
    'view_proposals',      // View proposals (read-only)
    'select_proposal',     // Select a proposal
    'validate',            // Validate (same button as UI)
    'reject'               // Reject (same button as UI)
  ],
  
  // FORBIDDEN (not in standard UI)
  forbidden: [
    'gesture_actions',     // No gesture-based actions
    'voice_commands',      // No voice commands
    'spatial_manipulation', // No spatial object manipulation
    'agent_summoning',     // No summoning agents in space
    'narrative_triggers',  // No narrative or story elements
    'immersive_effects',   // No immersive visual effects
    'ambient_interactions' // No ambient or passive interactions
  ]
} as const;

/**
 * XR Visual Settings - MINIMAL
 * Only spatial representation of existing data.
 */
export const XR_VISUAL_SETTINGS = {
  // Background - simple, no narrative
  background: {
    type: 'solid',
    color: '#0A0A0B'
  },
  
  // Proposals displayed as simple panels
  proposalDisplay: {
    type: 'panel',           // Simple flat panel
    noAnimation: true,       // No animations
    noEffects: true          // No visual effects
  },
  
  // Agents shown as static markers
  agentDisplay: {
    type: 'marker',          // Simple position marker
    noAnimation: true,
    noAvatars: true,         // No avatar representations
    noPersonality: true      // No personality indicators
  },
  
  // NO decorative elements
  decorations: {
    enabled: false
  }
} as const;

/**
 * XR Element - Minimal spatial representation
 */
export interface XRElement {
  id: string;
  type: 'proposal_panel' | 'agent_marker' | 'action_button';
  position: { x: number; y: number; z: number };
  
  // Reference to standard UI element
  standardUIElementId: string;
  
  // NO additional data
}

/**
 * XR Room - Spatial mirror of standard UI
 */
export interface XRRoom {
  meetingId: string;
  state: XRRoomState;
  
  // Elements mirror standard UI
  elements: XRElement[];
  
  // NO additional state
}

/**
 * Validate XR compliance
 */
export function validateXRCompliance(interaction: string): {
  allowed: boolean;
  reason?: string;
} {
  if (XR_INTERACTIONS.forbidden.includes(interaction as any)) {
    return {
      allowed: false,
      reason: `FORBIDDEN: ${interaction} not available in standard UI`
    };
  }
  
  if (!XR_INTERACTIONS.allowed.includes(interaction as any)) {
    return {
      allowed: false,
      reason: `UNKNOWN: ${interaction} not recognized`
    };
  }
  
  return { allowed: true };
}

export default XR_COMPLIANCE;
